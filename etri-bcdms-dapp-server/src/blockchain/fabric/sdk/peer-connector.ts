

import {
  Channel,
  ChaincodeInvokeRequest,
  ChaincodeInstantiateUpgradeRequest,
  TransactionRequest,
  Proposal,
  ProposalResponse,
  ChaincodeInstallRequest
} from 'fabric-client'
import * as _ from 'lodash'
import DAppFabricClient from './dapp-fabric-client'

export interface ISendTxProposalParams {
  channel: Channel
  request: ChaincodeInvokeRequest
}

export async function sendTxProposal({
  channel,
  request
}: ISendTxProposalParams): Promise<TransactionRequest> {
  const results = await channel.sendTransactionProposal(request)
  return parseResults(results)
}

export interface ISendInstProposalParams {
  channel: Channel
  request: ChaincodeInstantiateUpgradeRequest
  timeout: number
}

export async function sendInstProposal({ channel, request, timeout }: ISendInstProposalParams) {
  const results = await channel.sendInstantiateProposal(request, timeout) // timeout = 120000
  return parseResults(results)
}

export async function sendUpgradeProposal({ channel, request, timeout }: ISendInstProposalParams) {
  const results = await channel.sendUpgradeProposal(request, timeout) // timeout = 120000
  return parseResults(results)
}

export interface IISendSignalToInstallChaincode {
  request: ChaincodeInstallRequest
}

export async function sendSignalToInstallChaincode({ request }: IISendSignalToInstallChaincode) {
  const results = await DAppFabricClient.installChaincode(request)
  return parseResults(results)
}

function parseResults(results: [ProposalResponse[], Proposal]) {
  const proposalResponses: ProposalResponse[] = results[0]
  const proposal: Proposal = results[1] ? results[1] : undefined

  const errFromEndorser: string[] = []
  const allGood = proposalResponses.every(pr => {
    if (pr.response && pr.response.status === 200) {
      return true
    } else {
      // @ts-ignore
      errFromEndorser.push(pr.details)
      return false
    }
  })

  if (allGood) {
    return {
      proposal,
      proposalResponses
    }
  } else {
    const errListFromEndorsers = _.join(errFromEndorser, ', ')
    throw Error(`failed to send the proposal to endorsers. Error: ${errListFromEndorsers}`)
  }
}
