

import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as _ from 'lodash'
import { Peer, EventHub } from 'fabric-client'
import * as userAuth from './user'
import DAppFabricClient from './dapp-fabric-client'
import config, { rootPath } from './config'
import { logFncEnter, logToNetwork, logFromNetwork } from './sdk-logger'
import * as peerConnector from './peer-connector'
import * as ordererConnector from './orderer-connector'

export interface IChannelCreateParams {
  channelName: string
  orgName: string
}

// Attempt to send a request to the orderer with the sendCreateChain method
export async function create({ channelName, orgName }: IChannelCreateParams): Promise<string> {
  logFncEnter('invoke', { channelName, orgName })

  // TODO: 적절한 Org, User 가져오기 *************//
  // TODO: userAuth 수정 필요 (e.g. DAppFabricClient.switchToOrgAdmin(orgName))
  await userAuth.getOrgAdmin(orgName)
  // TODO: ***********************************//

  // extract the channel config bytes from the envelope to be signed
  const envelope = fs.readFileSync(path.join(rootPath.channelArtifacts, `${channelName}.tx`))
  const channelConfig = DAppFabricClient.extractChannelConfig(envelope)

  // sign the channel config bytes as "endorsement", this is required by
  // the orderer's channel creation policy
  const signature = DAppFabricClient.signChannelConfig(channelConfig)

  const request = {
    config: channelConfig,
    signatures: [signature],
    name: channelName,
    orderer: DAppFabricClient.getOrderers()[0],
    txId: DAppFabricClient.newTransactionID()
  }

  try {
    logToNetwork('Orderer', request)
    const response = await DAppFabricClient.createChannel(request)

    if (response && response.status === 'SUCCESS') {
      logFromNetwork('Orderer', response, true)
      return channelName
    } else {
      logFromNetwork('Orderer', response, false)
      throw Error(`Failed to create the channel ${channelName}.`)
    }
  } catch (err) {
    logFromNetwork('Orderer', err, false)
    throw err
  }
}

export interface IInstantiateParams {
  channelName: string
  chaincodeId: string
  chaincodeVersion: string
  args: string[]
  orgName: string
  isUpgrade: boolean
}

export async function instantiateChaincode({
  channelName,
  chaincodeId,
  chaincodeVersion,
  args,
  orgName,
  isUpgrade
}: IInstantiateParams): Promise<string> {
  const functionName: string = isUpgrade ? 'upgrade' : 'init'
  logFncEnter(functionName, { channelName, chaincodeId, chaincodeVersion, args, orgName })

  const channel = DAppFabricClient.getChannel(channelName)

  // TODO: 적절한 Org, User 가져오기 *************//
  await userAuth.getOrgAdmin(orgName)
  // TODO: ***********************************//

  // Channel의 최신 설정(MSP 정보 등)을 불러옴
  await channel.initialize()

  const txID = DAppFabricClient.newTransactionID()

  const endorsers = DAppFabricClient.getEndorsingPeerList(channelName)
  if (endorsers.length === 0) {
    throw Error('at least one endorser needed')
  }

  // send proposal to endorser
  // Get the channel configuration
  const channelConfig = config.data.networkConfig.channelMap[channelName]

  const requestToAllEndorsers = {
    chaincodeId,
    chaincodeVersion,
    args,
    txId: txID,
    targets: endorsers,
    fcn: functionName,
    'endorsement-policy': channelConfig['endorsement-policy']
  }

  // Send to endorsers
  let txRequest
  try {
    logToNetwork('Endorsers', requestToAllEndorsers)
    txRequest = isUpgrade
      ? await peerConnector.sendUpgradeProposal({
          channel,
          request: requestToAllEndorsers,
          timeout: 120000
        })
      : await peerConnector.sendInstProposal({
          channel,
          request: requestToAllEndorsers,
          timeout: 120000
        })
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
