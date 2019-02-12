
import * as log4js from 'log4js'
import { ChaincodeQueryResponse, Block, BlockchainInfo } from 'fabric-client'
import DAppFabricClient from './dapp-fabric-client'
import * as userAuth from './user'
import * as gwutil from './util'
import { logFncEnter, logToNetwork, logFromNetwork } from './sdk-logger'

const logger = log4js.getLogger('GatewayQuery')
logger.setLevel('DEBUG')

export interface IGetBlockByNumberParams {
  peerString: string
  height: string
  channelName: string
}

export async function getBlockByNumber({
  peerString,
  height,
  channelName
}: IGetBlockByNumberParams): Promise<Block> {
  const orgPeerDef = gwutil.parsePeerString(peerString)
  const org = orgPeerDef.orgName
  const peer = orgPeerDef.peerName

  const channel = DAppFabricClient.getChannel(channelName)
  const target = DAppFabricClient.getPeer(org, peer)

  await userAuth.getOrgAdmin(org)

  const blockNumber = parseInt(height, 10)
  if (!Number.isInteger(blockNumber)) {
    throw Error('invalid height value')
  }

  try {
    logToNetwork(`Peer ${peerString}`, { blockNumber, target })
    const responsePayloads = await channel.queryBlock(blockNumber, target)
    logFromNetwork(`Peer ${peerString}`, responsePayloads, true)

    return responsePayloads
  } catch (err) {
    logFromNetwork(`Peer ${peerString}`, err, false)
    throw err
  }
}

export interface IGetTransactionByIDParams {
  peerString: string
  txID: string
  channelName: string
}

export async function getTransactionByID({
  peerString,
  txID,
  channelName
}: IGetTransactionByIDParams): Promise<any> {
  logFncEnter('get-tx', { channelName, peerString, txID })

  const orgPeerDef = gwutil.parsePeerString(peerString)
  const org = orgPeerDef.orgName
  const peer = orgPeerDef.peerName

  const channel = DAppFabricClient.getChannel(channelName)
  const target = DAppFabricClient.getPeer(org, peer)

  await userAuth.getOrgAdmin(org)

  try {
    logToNetwork(`Peer ${peerString}`, { txID, target })
    const responsePayloads = await channel.queryTransaction(txID, target)
    logFromNetwork(`Peer ${peerString}`, responsePayloads, true)

    return responsePayloads
  } catch (err) {
    logFromNetwork(`Peer ${peerString}`, err, false)
    throw err
  }
}

export interface IGetChannelInfoParams {
  peerString: string
  channelName: string
}

export async function getChannelInfo({
  peerString,
  channelName
}: IGetChannelInfoParams): Promise<BlockchainInfo> {
  const orgPeerDef = gwutil.parsePeerString(peerString)
  const org = orgPeerDef.orgName
  const peer = orgPeerDef.peerName

  const channel = DAppFabricClient.getChannel(channelName)
  const target = DAppFabricClient.getPeer(org, peer)

  await userAuth.getOrgAdmin(org)

  try {
    logToNetwork(`Peer ${peerString}`, { target })
    const channelInfo = await channel.queryInfo(target)
    logFromNetwork(`Peer ${peerString}`, channelInfo, true)

    return channelInfo
  } catch (err) {
    logFromNetwork(`Peer ${peerString}`, err, false)
    throw err
  }
}
