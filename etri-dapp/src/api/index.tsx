import axios from 'axios'
import {
  User,
  Author,
  Evaluation,
  ResponseBody,
  DocumentType,
  Document,
  RootState,
  UserTokenInfo,
  QueryTokenResponse,
  Block,
  Transaction,
  History
} from '../types/index'
import * as uuid from 'uuid'
import { AnyAction, Store } from 'redux'
import { UserActionType } from '../actions/user'

export const config = {
  setupInterceptors: (store: Store<RootState, AnyAction>) => {
    axios.interceptors.response.use(
      function(response) {
        return response
      },
      function(error) {
        console.log(error)
        if (401 === error.response.status) {
          localStorage.removeItem('user')
          store.dispatch({
            type: UserActionType.LOGIN_FAILURE
          })
          return Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
      }
    )
  }
}

export const common = {
  setJwt
}

const URL = 'http://localhost:4000'

function setJwt(jwt: string) {
  console.log(`setting jwt: ${jwt}`)
  axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}

export const userApi = {
  login,
  loginWithJWT,
  register,
  getAuthor
}

async function getAuthor(userID: string): Promise<Author> {
  const res = await axios.get(`${URL}/user/${userID}`)
  const response: ResponseBody = res.data
  const author: Author = response.payload

  return author
}

async function loginWithJWT(userID: string, jwt: string): Promise<User> {
  const requestBody = {
    jwt: jwt
  }

  const res = await axios.post(`${URL}/user/${userID}`, requestBody)
  const response: ResponseBody = res.data
  const user: User = response.payload
  setJwt(user.jwt)

  return {
    departmentName: user.departmentName,
    loggedIn: true,
    jwt: user.jwt,
    orgName: user.orgName,
    userID: user.userID,
    userName: user.userName
  } as User
}

async function register(
  userID: string,
  userName: string,
  orgName: string,
  departmentName: string,
  password: string
): Promise<User> {
  const requestBody = {
    userID: userID,
    userName: userName,
    orgName: orgName,
    departmentName: departmentName,
    password: password
  }

  const res = await axios.post(`${URL}/user`, requestBody)
  const response: ResponseBody = res.data
  const user: User = response.payload

  return user
}

async function login(
  id: string,
  orgName: string,
  departmentName: string,
  password: string
): Promise<User> {
  const requestBody = {
    orgName: orgName,
    departmentName: departmentName,
    password: password
  }

  const res = await axios.post(`${URL}/user/` + id, requestBody)
  const response: ResponseBody = res.data
  const user: User = response.payload
  setJwt(user.jwt)

  console.log(response)

  return {
    departmentName: departmentName,
    loggedIn: true,
    jwt: user.jwt,
    orgName: orgName,
    userID: id,
    password: password,
    userName: user.userName
  } as User
}

export const documentApi = {
  getDocument,
  getDocuments,
  updateDocument,
  createDocument,
  download
}

async function updateDocument(
  id: string,
  title: string,
  authorList: Author[],
  projectID: string,
  version: string,
  issueDate: number,
  docType: string,
  documentFile: File
): Promise<void> {
  let formData = new FormData()
  formData.append('title', title)
  formData.append('authorList', JSON.stringify(authorList))
  formData.append('projectID', projectID)
  formData.append('fileName', documentFile.name)
  formData.append('version', version)
  formData.append('issueDate', issueDate.toString())
  formData.append('documentFile', documentFile)

  await axios({
    method: 'post',
    url: `${URL}/document/${docType}/${id}`,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data; boundary=__X_PAW_BOUNDARY__' }
  })
}

async function download(docType: string, docID: string, fileName: string): Promise<void> {
  axios({
    method: 'get',
    url: `${URL}/document/${docType}/${docID}/file`,
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  })
}

async function getDocuments(
  docType: DocumentType,
  startIndex: number,
  endIndex: number
): Promise<Document[]> {
  const res = await axios.get(
    `${URL}/document/` + docType + '?' + 'start=' + startIndex + '&end=' + endIndex
  )
  const response: ResponseBody = res.data
  const documents: Document[] = response.payload

  console.log(response)

  return documents
}

async function getDocument(docType: string, id: string): Promise<any> {
  const res = await axios.get(`${URL}/document/` + docType + '/' + id)
  const body: ResponseBody = res.data
  const document: any = body.payload

  return document
}

async function createDocument(
  title: string,
  authorList: Author[],
  projectID: string,
  version: string,
  issueDate: number,
  docType: DocumentType,
  documentFile: File
): Promise<void> {
  let formData = new FormData()
  formData.append('title', title)
  formData.append('authorList', JSON.stringify(authorList))
  formData.append('projectID', projectID)
  formData.append('fileName', documentFile.name)
  formData.append('version', version)
  formData.append('issueDate', issueDate.toString())
  formData.append('documentFile', documentFile)

  await axios({
    method: 'post',
    url: `${URL}/document/${docType.toString()}/${uuid.v4()}`,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data; boundary=__X_PAW_BOUNDARY__' }
  })
}

export const evaluationApi = {
  evaluate,
  queryEvaluation
}

async function evaluate(
  id: string,
  score: number,
  comment: string,
  date: number,
  documentID: string,
  documentHashValue: string
): Promise<Evaluation> {
  const requestBody = {
    id: id,
    score: score,
    comment: comment,
    date: date,
    documentID: documentID,
    documentHashValue: documentHashValue
  }

  const res = await axios.post(`${URL}/evaluation/` + uuid.v4(), requestBody)
  const body: ResponseBody = res.data
  const evaluation: Evaluation = body.payload

  return evaluation
}

async function queryEvaluation(id: string): Promise<Evaluation> {
  const res = await axios.get(`${URL}/evaluation/` + id)
  const evaluation: Evaluation = res.data

  return evaluation
}

export const tokenApi = {
  queryToken,
  transfer
}

async function queryToken(startIndex: number, lastIndex: number): Promise<UserTokenInfo> {
  const res = await axios.get(`${URL}/token?start=${startIndex}&end=${lastIndex}`)
  const body: ResponseBody = res.data
  const queryTokenResponse: QueryTokenResponse = body.payload

  return queryTokenResponse.userTokenInfo
}

async function transfer(
  sourceUserID: string,
  targetUserID: string,
  amount: number,
  timestamp: number
) {
  const requestBody = {
    sourceUserID,
    targetUserID,
    amount,
    timestamp
  }
  const res = await axios.post(`${URL}/token/transfer`, requestBody)
  const body: ResponseBody = res.data
  const payload = body.payload

  return payload
}

export const blockApi = {
  getBlockByHeight,
  getTransactionByID,
  getLastBlock,
  getTransactionList
}

const defaultPeer = 'org1-peer1'

async function getBlockByHeight(height: number, channel: string): Promise<Block> {
  const res = await axios.get(
    `${URL}/network/peers/${defaultPeer}/block/${height}?channel=${channel}`
  )
  const body: ResponseBody = res.data
  const block: Block = body.payload

  return block
}

async function getLastBlock(channel: string): Promise<Block> {
  const res = await axios.get(`${URL}/network/peers/${defaultPeer}/last-block?channel=${channel}`)
  const body: ResponseBody = res.data
  const block: Block = body.payload

  return block
}

async function getTransactionByID(transactionID: string, channel: string): Promise<Transaction> {
  const res = await axios.get(
    `${URL}/network/peers/${defaultPeer}/tx/${transactionID}?channel=${channel}`
  )
  const body: ResponseBody = res.data
  const transaction: Transaction = body.payload

  return transaction
}

async function getTransactionList(startIdx: number, endIdx: number) {
  const res = await axios.get(
    `${URL}/network/peers/${defaultPeer}/tx?startIdx=${startIdx}&endIdx=${endIdx}`
  )
  const body: ResponseBody = res.data
  const transactionList: History[] = body.payload

  return transactionList
}
