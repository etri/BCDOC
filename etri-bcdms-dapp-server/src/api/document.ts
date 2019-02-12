/*
 * Copyright ETRI. All Rights Reserved.
 */
 
import * as express from 'express'
import * as crypto from 'crypto'
import * as multer from 'multer'
import * as path from 'path'
import { IFabricGateway } from '../blockchain/fabric'
import { logAPIEnter, logAPIError, logKeyValue } from './api-logger'
import * as jwt from './jwt'
import { giveReward } from './intra-call'
import * as docDB from '../db/document'
import * as txDB from '../db/transaction'

const GET_DOCUMENT_LIST = '/document/:docType'
const GET_DOCUMENT = '/document/:docType/:docID'
const DOWNLOAD_FILE = '/document/:docType/:docID/file'
const CREATE_DOCUMENT = '/document/:docType/:docID'
const GET_EVALUATION = '/evaluation/:evaluationID'
const CREATE_EVALUATION = '/evaluation/:evaluationID'

export default function configure(app: express.Application, gateway: IFabricGateway) {
  app.get(GET_DOCUMENT_LIST, getDocumentListHandler(gateway))
  app.get(GET_DOCUMENT, getDocumentHandler(gateway))
  app.get(DOWNLOAD_FILE, downloadFileHandler(gateway))
  app.post(
    CREATE_DOCUMENT,
    jwt.handleToken,
    multer({ dest: './static/documents' }).single('documentFile'),
    createDocumentHandler(gateway)
  )
  app.get(GET_EVALUATION, getEvaluationHandler(gateway))
  app.post(CREATE_EVALUATION, jwt.handleToken, createEvaluationHandler(gateway))
}

function createDocumentHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { docType, docID } = req.params
    const { title, authorList, projectID, fileName, version, issueDate } = req.body
    const { orgName, userName } = req.userInfo
    const documentFileInfo = req.file

    logAPIEnter('Create-document', req.path, {
      docType,
      docID,
      title,
      authorList,
      projectID,
      fileName,
      version,
      issueDate,
      orgName,
      userName,
      documentFileInfo
    })

    // TODO: 수정 가능.
    const parsedAuthorList = JSON.parse(authorList)

    try {
      // Create the envelop and hashValue
      const issueDateNum = Number.parseInt(issueDate, 10)
      if (!Number.isInteger(issueDateNum)) {
        throw Error('wrong arguments')
      }

      const envelope = {
        fileName,
        version,
        issueDate: issueDateNum
      }

      const hashValue = crypto
        .createHash('sha256')
        .update(JSON.stringify(envelope))
        .digest('base64')

      const evaluationList: any[] = []

      const newDocument = {
        id: docID,
        type: docType,
        versionList: [
          {
            title,
            authorList: parsedAuthorList,
            projectID,
            envelope,
            hashValue,
            evaluationList,
            score: 0
          }
        ]
      }

      // Create a document on CC
      const channelName = 'evaluationch'
      const contractName = 'etri-bcdms-evaluation-chaincode'
      const functionName = 'CREATE_OR_UPDATE_DOCUMENT'
      const args = [JSON.stringify({ newDocument })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        orgName,
        userName,
        isAdmin: false
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.success) {
        throw Error('failed to create a new document on the blockchain')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      // Create a document on DB
      await docDB.createOrUpdateDocument({
        id: docID,
        type: docType,
        title,
        issueDate: issueDateNum,
        authorList,
        projectID,
        fileName,
        version,
        score: 0,
        hashValue,
        documentFileInfo
      })

      // Give a reward
      await giveReward(userName, orgName, 0, docID, payload.txID, gateway)

      // Return
      res.status(200).send({
        success: true,
        message: 'successfully create a document',
        payload: newDocument
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to create a document',
        payload: err.message
      })
    }
  }
}

function getDocumentListHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { docType } = req.params
    const { start, end } = req.query

    logAPIEnter('Get-document-list', req.path, { docType, start, end })

    try {
      const startIdx = Number.parseInt(start, 10)
      const endIdx = Number.parseInt(end, 10)
      if (!docType || startIdx > endIdx || startIdx < 0 || endIdx < 0) {
        throw Error('wrong arguments')
      }

      // Get reputation value list from the CC
      const channelName = 'evaluationch'
      const contractName = 'etri-bcdms-evaluation-chaincode'
      const functionName = 'GET_DOCUMENT_LIST'
      const args = [
        JSON.stringify({
          documentType: docType,
          startIdx,
          endIdx
        })
      ]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: true
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.documentList) {
        throw Error('no document list')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      const documentIDList: string[] = []
      const documentSet: { [id: string]: any } = {}
      payload.documentList.forEach((document: any) => {
        documentIDList.push(document.id)
        documentSet[document.id] = document.versionList[0]
      })

      // Get document list from the DB
      const documentList = await docDB.readDocumentList(documentIDList)

      // Combine them
      documentList.forEach(document => {
        const docFromCC = documentSet[document.id]

        document.issueDate = docFromCC.envelope.issueDate
        document.version = docFromCC.envelope.version
        document.score = docFromCC.score
        document.hashValue = docFromCC.hashValue
        document.evaluationList = docFromCC.evaluationList
      })

      // Return
      res.status(200).send({
        success: true,
        message: 'successfully retrieve the document list',
        payload: documentList
      })
    } catch (err) {
      logAPIError('Get-document-list', req.path, err)
      res.status(400).send({
        success: false,
        message: 'failed to get the document list',
        payload: err.message
      })
    }
  }
}

function createEvaluationHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { evaluationID } = req.params
    const { score, comment, date, documentID, documentHashValue, id } = req.body
    const { orgName, userName } = req.userInfo

    logAPIEnter('Create-evaluation', req.path, {
      evaluationID,
      score,
      comment,
      date,
      documentID,
      documentHashValue,
      orgName,
      userName
    })

    try {
      const scoreNum = Number.parseInt(score)
      const dateNum = Number.parseInt(date)
      if (!Number.isInteger(scoreNum) || !Number.isInteger(dateNum)) {
        throw Error('wrong arguments')
      }

      const newEvaluation = {
        id: evaluationID,
        score: scoreNum,
        comment,
        date: dateNum,
        documentID,
        documentHashValue,
        evaluatorID: id
      }

      // Send to CC
      const channelName = 'evaluationch'
      const contractName = 'etri-bcdms-evaluation-chaincode'
      const functionName = 'CREATE_OR_UPDATE_EVALUATION'
      const args = [JSON.stringify({ newEvaluation })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        orgName,
        userName,
        isAdmin: false
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.success) {
        throw Error('failed to create a new document on the blockchain')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      // Give a reward
      await giveReward(userName, orgName, 1, evaluationID, payload.txID, gateway)

      res.status(200).send({
        success: true,
        message: 'successfully create an evaluation',
        payload: newEvaluation
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to create an evaluation',
        payload: err.message
      })
    }
  }
}

function getDocumentHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { docType, docID } = req.params

    logAPIEnter('Get-document', req.path, { docType, docID })

    try {
      // Send to CC
      const channelName = 'evaluationch'
      const contractName = 'etri-bcdms-evaluation-chaincode'
      const functionName = 'GET_DOCUMENT'
      const args = [JSON.stringify({ documentID: docID, documentType: docType })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: true
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.document) {
        throw Error('wrong payload')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      res.status(200).send({
        success: true,
        message: 'successfully get a document',
        payload: payload.document
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get a document',
        payload: err.message
      })
    }
  }
}

function downloadFileHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { docType, docID } = req.params

    logAPIEnter('download a file', req.path, { docType, docID })

    try {
      // Get a file info from DB
      const document = await docDB.readDocument(docID)
      if (!document) {
        throw Error('no such document')
      }

      const fileInfo = document.documentFileInfo
      if (!fileInfo) {
        throw Error('no related file')
      }

      const filePath = path.resolve(fileInfo.path)
      res.download(filePath, fileInfo.originalname)
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to download a file',
        payload: err.message
      })
    }
  }
}

function getEvaluationHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { evaluationID } = req.params

    logAPIEnter('Get-evaluation', req.path, { evaluationID })

    try {
      // Send to CC
      const channelName = 'evaluationch'
      const contractName = 'etri-bcdms-evaluation-chaincode'
      const functionName = 'GET_EVALUATION'
      const args = [JSON.stringify({ evaluationID })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: true
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.evaluation) {
        throw Error('wrong payload')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      res.status(200).send({
        success: true,
        message: 'successfully get an evaluation',
        payload: payload.evaluation
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get a evaluation',
        payload: err.message
      })
    }
  }
}
