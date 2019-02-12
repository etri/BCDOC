/*
 * Copyright ETRI. All Rights Reserved.
 */

import { IFabricGateway } from '../blockchain/fabric'
import * as txDB from '../db/transaction'

export async function giveReward(
  userID: string,
  orgName: string,
  dealType: number,
  refID: string,
  txID: string,
  gateway: IFabricGateway
) {
  const current = new Date()
  const date = current.getTime()

  const channelName = 'tokench'
  const contractName = 'etri-bcdms-token-chaincode'
  const functionName = 'GIVE_REWARD'
  const args = [
    JSON.stringify({
      userID,
      deal: {
        id: `${date}.${userID}`,
        amount: 0,
        date,
        txID,
        dealType,
        refID
      }
    })
  ]

  const response = await gateway.contractManager.invoke({
    channelName,
    contractName,
    functionName,
    args,
    isAdmin: false,
    userName: userID,
    orgName
  })
  if (!response) {
    throw Error('empty response from the chaincode')
  }

  const payload = JSON.parse(response)
  if (!payload.success) {
    throw Error('failed to give the reward')
  }

  // Save txID
  await txDB.createTransaction(payload.txID, channelName)
}
