

import * as util from 'util'
import * as log4js from 'log4js'
import { EventHub } from 'fabric-client'
import DAppFabricClient from './dapp-fabric-client'
import * as userAuth from './user'
import { logFncEnter, logFromNetwork, logToNetwork } from './sdk-logger'
import * as ordererConnector from './orderer-connector'
import * as peerConnector from './peer-connector'

const logger = log4js.getLogger('GatewayPeer')
logger.setLevel('DEBUG')

export interface IJoinChannelParams {
  channelName: string
  peerIDList: string[]
  orgName: string
}

export async function joinChannel({
  channelName,
  peerIDList,
  orgName
}: IJoinChannelParams): Promise<void> {
  logFncEnter('join-channel', { channelName, peerIDList, orgName })

  // TODO: 적절한 Org, User 가져오기 *************//
  await userAuth.getOrgAdmin(orgName)
  // TODO: ***********************************//

  const channel = DAppFabricClient.getChannel(channelName)

  // Get the channel genesis block
  const genesisBlock = await channel.getGenesisBlock({
    txId: DAppFabricClient.newTransactionID()
  })

  const request = {
    targets: peerIDList.map(peerID => DAppFabricClient.getPeer(orgName, peerID)),
    txId: DAppFabricClient.newTransactionID(),
    block: genesisBlock
  }

  try {
    logToNetwork('Orderer', request)
    await ordererConnector.sendTxToJoinChannel({
      channelName,
      channel,
      orgName,
      peerIDList,
      request
    })
    logFromNetwork('Orderer(Broadcast Response)', peerIDList, true)
  } catch (err) {
    logFromNetwork('Orderer(Broadcast Response)', err, false)
  }
}

export interface IInstallChaincodeParams {
  peerIDList: string[]
  chaincodeName: string
  chaincodePath: string
  chaincodeVersion: string
  orgName: string
}

export async function installChaincode({
  peerIDList,
  chaincodeName,
  chaincodePath,
  chaincodeVersion,
  orgName
}: IInstallChaincodeParams): Promise<void> {
  logFncEnter('install-chaincode', {
    peerIDList,
    chaincodeName,
    chaincodePath,
    chaincodeVersion,
    orgName
  })

  // DAppFabricClient의 Store 상태를 변환하는 것으로 추측
  // TODO: DAppFabricClient.changeStoresToOrgAdmin 같은 식으로 쓸 수 있는지 확인
  // TODO: 적절한 Org, User 가져오기 *************//
  await userAuth.getOrgAdmin(orgName)
  // TODO: ***********************************//

  const request = {
    targets: peerIDList.map(peerID => DAppFabricClient.getPeer(orgName, peerID)),
    // dapp server 설치한 host의 default GOPATH를 base path로 사용
    chaincodePath,
    chaincodeId: chaincodeName,
    chaincodeVersion,
    txId: DAppFabricClient.newTransactionID()
  }

  try {
    logToNetwork('Endorser', request)
    await peerConnector.sendSignalToInstallChaincode({ request })
    logFromNetwork('Endorser', peerIDList, true)
  } catch (err) {
    logFromNetwork('Endorser', peerIDList, true)
    throw err
  }
}
