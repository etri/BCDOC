/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as express from 'express'
import * as crypto from 'crypto'
import { IFabricGateway } from '../blockchain/fabric'
import { logAPIEnter, logAPIError } from './api-logger'
import * as jwt from './jwt'
import * as txDB from '../db/transaction'

const GET_DEAL_HISTORY = '/token'
const TRANSFER = '/token/transfer'
const MINT = '/token/mint'

export default function configure(app: express.Application, gateway: IFabricGateway) {
  app.get(GET_DEAL_HISTORY, jwt.handleToken, getDealHistroyHandler(gateway))
  app.post(TRANSFER, jwt.handleToken, transferHandler(gateway))
  app.post(MINT, jwt.handleAdminToken, mintHandler(gateway))
}

function mintHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { amount } = req.body
    const { userName, orgName } = req.userInfo

    logAPIEnter('Mint', req.path, { amount })

    try {
      const amountNum = Number.parseInt(amount)
      if (!Number.isInteger(amountNum)) {
        throw Error('wrong arguments')
      }

      // Send to CC
      const channelName = 'tokench'
      const contractName = 'etri-bcdms-token-chaincode'
      const functionName = 'MINT'
      const args = [JSON.stringify({ amount: amountNum })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: false,
        userName,
        orgName
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.success) {
        throw Error('wrong payload')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      res.status(200).send({
        success: true,
        message: 'successfully mint',
        payload: response
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to mint',
        payload: err.message
      })
    }
  }
}

function transferHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { sourceUserID, targetUserID, amount, timestamp } = req.body
    const { userName, orgName } = req.userInfo

    logAPIEnter('Transfer', req.path, { sourceUserID, targetUserID, amount, timestamp })

    try {
      const amountNum = Number.parseInt(amount)
      const timestampNum = Number.parseInt(timestamp)
      if (!Number.isInteger(amountNum) || !Number.isInteger(timestampNum)) {
        throw Error('wrong arguments')
      }

      // Send to CC
      const channelName = 'tokench'
      const contractName = 'etri-bcdms-token-chaincode'
      const functionName = 'TRANSFER'
      const args = [
        JSON.stringify({ amount: amountNum, timestamp: timestampNum, sourceUserID, targetUserID })
      ]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: false,
        userName,
        orgName
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.success) {
        throw Error('wrong payload')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      res.status(200).send({
        success: true,
        message: 'successfully transfer',
        payload: response
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to transfer',
        payload: err.message
      })
    }
  }
}

function getDealHistroyHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { start, end } = req.query
    const { userName, orgName } = req.userInfo

    logAPIEnter('Get-deal-history', req.path, { start, end, userName, orgName })

    try {
      const startIdx = Number.parseInt(start, 10)
      const endIdx = Number.parseInt(end, 10)
      if (startIdx > endIdx || startIdx < 0 || endIdx < 0) {
        throw Error('wrong arguments')
      }

      // Send to CC
      const channelName = 'tokench'
      const contractName = 'etri-bcdms-token-chaincode'
      const functionName = 'GET_USER_TOKEN_INFO'
      const args = [JSON.stringify({ userID: userName, startIdx, endIdx })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: false,
        userName,
        orgName
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      res.status(200).send({
        success: true,
        message: 'successfully get the user token info',
        payload
      })
    } catch (err) {
      logAPIError('Get-deal-history', req.path, err)
      res.status(400).send({
        success: false,
        message: 'failed to get the user token info',
        payload: err.message
      })
    }
  }
}
