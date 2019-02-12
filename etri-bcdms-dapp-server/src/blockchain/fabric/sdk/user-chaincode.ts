
import * as util from 'util'
import * as log4js from 'log4js'
import * as _ from 'lodash'
import {
  Peer,
  ChaincodeInvokeRequest,
  EventHub,
  ChaincodeQueryRequest,
  TransactionRequest
} from 'fabric-client'
import DAppFabricClient from './dapp-fabric-client'
import * as userAuth from './user'
import * as gwutil from './util'
import config from './config'
import { logFncEnter, logToNetwork, logFromNetwork } from './sdk-logger'
import * as peerConnector from './peer-connector'
import * as ordererConnector from './orderer-connector'

const logger = log4js.getLogger('FabricSDK')
logger.setLevel('DEBUG')

export interface IInvokeParams {
  channelName: string
  chaincodeId: string
  functionName: string
  args: string[]
  orgName?: string
  userName?: string
  isAdmin: boolean
}

// TODO: UserName, OrgName 모두 JWT를 통해 파싱되어 인풋으로 들어와야 함
export async function invoke({
  channelName,
  chaincodeId,
  functionName,
  args,
  orgName,
  userName,
  isAdmin
}: IInvokeParams): Promise<string> {
  logFncEnter('invoke', { channelName, chaincodeId, functionName, args })

  if (!(channelName && chaincodeId && functionName && args)) {
    throw Error('insufficient parameters')
  }

  // Get the channel
  const channel = DAppFabricClient.getChannel(channelName)
  if (!channel) {
    throw Error('no such channel')
  }

  // Get the endorsers
  const endorsers = DAppFabricClient.getEndorsingPeerList(channelName)
  if (endorsers.length === 0) {
    throw Error('at least one endorser needed')
  }

  if (!isAdmin) {
    await userAuth.getLoggedInUser(orgName, userName)
  } else {
    // Use the first org to sign the tx
    // Get the channel configuration
    const channelConfig = config.data.networkConfig.channelMap[channelName]
    const channelOrgList = _.keys(channelConfig.organizationMap)
    orgName = channelOrgList[0]
    // Get the user to sign a transaction
    await userAuth.getOrgAdmin(orgName)
  }

  const txID = DAppFabricClient.newTransactionID()

  // send proposal to endorser
  const requestForEndorsement: ChaincodeInvokeRequest = {
    chaincodeId,
    fcn: functionName,
    args,
    txId: txID,
    targets: endorsers
  }

  let txRequest
  try {
    logToNetwork('Endorsers', requestForEndorsement)
    txRequest = await peerConnector.sendTxProposal({ channel, request: requestForEndorsement })
    logFromNetwork('Endorsers', txRequest.proposalResponses[0].response, true)
  } catch (err) {
    logFromNetwork('Endorser', err, false)
    throw err
  }

  try {
    // Send to the orderer
    logToNetwork('Orderer', txRequest)
    const resultValue = await ordererConnector.sendTx({
      orgName,
      channel,
      txRequest,
      txID: txID.getTransactionID()
    })
    logFromNetwork('Orderer(Broadcast Response)', resultValue, true)

    return resultValue
  } catch (err) {
    logFromNetwork('Orderer(Broadcast Response)', err, false)
    throw err
  }
}

export interface IQueryParams {
  peerID: string
  channelName: string
  chaincodeId: string
  args: string[]
  functionName: string
  orgName: string
}

export async function query({
  peerID,
  channelName,
  chaincodeId,
  args,
  functionName,
  orgName
}: IQueryParams): Promise<string> {
  logFncEnter('query', { peerID, channelName, chaincodeId, functionName, args, orgName })

  const channel = DAppFabricClient.getChannel(channelName)
  const target = gwutil.parsePeer(peerID)
  if (!target) {
    throw Error('no target peer to query')
  }

  await userAuth.getOrgAdmin(orgName)

  const txId = DAppFabricClient.newTransactionID()

  // send query
  const request: ChaincodeQueryRequest = {
    chaincodeId,
    fcn: functionName,
    args,
    targets: [target]
  }

  try {
    logToNetwork(`Peer: ${peerID}`, request)
    const responsePayloads = await channel.queryByChaincode(request)

    if (responsePayloads && responsePayloads[0]) {
      if (responsePayloads[0] instanceof Error) {
        throw responsePayloads[0]
      } else {
        return responsePayloads[0].toString()
      }
    } else {
      logFromNetwork(`Peer: ${peerID}`, 'response_payloads is null', false)
      throw Error('response_payloads is null')
    }
  } catch (err) {
    logFromNetwork(`Peer: ${peerID}`, err, false)
    throw err
  }
}
