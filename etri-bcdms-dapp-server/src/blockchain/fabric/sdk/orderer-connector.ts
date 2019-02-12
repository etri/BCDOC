

import { EventHub, Channel, TransactionRequest, JoinChannelRequest, Block } from 'fabric-client'
import * as _ from 'lodash'
import config from './config'
import DAppFabricClient from './dapp-fabric-client'

export interface ISendTxParams {
  orgName: string
  channel: Channel
  txRequest: TransactionRequest
  txID: string
}

export async function sendTx({
  orgName,
  channel,
  txRequest,
  txID
}: ISendTxParams): Promise<string> {
  const eventPromiseList = getTxEventPromiseList(orgName, txID)
  const sendPromise = channel.sendTransaction(txRequest)

  // Send to the orderer
  const resultFromEvents = await Promise.all([sendPromise].concat(eventPromiseList))

  if (resultFromEvents[0].status === 'SUCCESS') {
    // Convert ByteBuffer to String
    const resultValue = txRequest.proposalResponses[0].response.payload.toString('utf8')
    return resultValue
  } else {
    throw Error(`Error code: ${resultFromEvents[0].status}`)
  }
}

export interface ISendTxToJoinChannel {
  channelName: string
  channel: Channel
  orgName: string
  peerIDList: string[]
  request: JoinChannelRequest
}

export async function sendTxToJoinChannel({
  channelName,
  channel,
  orgName,
  peerIDList,
  request
}: ISendTxToJoinChannel) {
  const eventHubList: EventHub[] = []
  peerIDList.forEach(peerID => {
    const eh = DAppFabricClient.getEventHubForPeer(orgName, peerID)
    if (eh) {
      eh.connect()
      eventHubList.push(eh)
    }
  })

  const eventPromiseList = getBlockEventHubPromise(eventHubList, orgName, channelName)
  const sendPromise = channel.joinChannel(request)

  const results = await Promise.all([sendPromise].concat(eventPromiseList))

  if (
    !(
      results[0] &&
      results[0][0] &&
      results[0][0].response &&
      results[0][0].response.status === 200
    )
  ) {
    throw Error(`failed to join the channel. Peer list: ${peerIDList}`)
  }
}

function getTxEventPromiseList(orgName: string, transactionID: string): Array<Promise<any>> {
  // Prepare event-hub
  const orgConfig = config.data.networkConfig.organizationMap
  const eventHubList: EventHub[] = []
  _.keys(orgConfig[orgName].peerMap).forEach(peerID => {
    eventHubList.push(DAppFabricClient.getEventHubForPeer(orgName, peerID))
  })

  return eventHubList.map(eventHub => {
    eventHub.connect()

    return new Promise((resolve, reject) =>
      eventHub.registerTxEvent(transactionID, (tx: string, code: string) => {
        const peerAddr = eventHub.getPeerAddr()

        // Timeout 설정: 30sec
        clearTimeout(
          setTimeout(() => {
            eventHub.disconnect()
            reject(Error(`timeout transaction, addr = ${peerAddr}`))
          }, 30000)
        )

        eventHub.unregisterTxEvent(transactionID)
        eventHub.disconnect()

        if (code !== 'VALID') {
          reject(Error(`(EH)Peer: ${peerAddr}. Error code: ${code}`))
        } else {
          resolve()
        }
      })
    )
  })
}

function getBlockEventHubPromise(
  eventHubList: EventHub[],
  orgName: string,
  channelName: string
): Array<Promise<any>> {
  return eventHubList.map(eventHub => {
    return new Promise((resolve, reject) => {
      // TODO: 이 부분 코드 반드시 이해해야 함!!!!!!!!!!! TODO:
      const handle = setTimeout(reject, 30000)
      const registrationNum = eventHub.registerBlockEvent((block: Block) => {
        clearTimeout(handle)

        eventHub.unregisterBlockEvent(registrationNum)
        eventHub.disconnect()

        // in real-world situations, a peer may have more than one channels so
        // we must check that this block came from the channel we asked the peer to join
        if (block.data.data.length === 1) {
          // Config block must only contain one transaction
          const channel_header = block.data.data[0].payload.header.channel_header
          if (channel_header.channel_id === channelName) {
            resolve()
          } else {
            reject()
          }
        }
      })
      // TODO: 이 부분 코드 반드시 이해해야 함!!!!!!!!!!! TODO:
    })
  })
}
