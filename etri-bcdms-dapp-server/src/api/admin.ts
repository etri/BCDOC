/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as express from 'express'
import * as crypto from 'crypto'
import { IFabricGateway } from '../blockchain/fabric'
import { logAPIEnter, logAPIError } from './api-logger'
import * as jwt from './jwt'

const UPDATE_REWARD_VALUE = '/admin/rewardvalue'

export default function configure(app: express.Application, gateway: IFabricGateway) {
  app.post(UPDATE_REWARD_VALUE, jwt.handleAdminToken, updateRewardValueHandler(gateway))
}

function updateRewardValueHandler(gateway: IFabricGateway) {
  return async (req: jwt.IRequestWithAuth, res: express.Response) => {
    const { rewardKind, rewardValue } = req.body
    const { orgName, userName } = req.userInfo

    logAPIEnter('Update reward value', req.path, { rewardKind, rewardValue, orgName, userName })

    try {
      const rewardValueNum = Number.parseInt(rewardValue, 10)
      if (!Number.isInteger(rewardValueNum)) {
        throw Error('wrong arguments')
      }

      const rewardKindNum = Number.parseInt(rewardKind, 10)
      if (!Number.isInteger(rewardKindNum)) {
        throw Error('wrong arguments')
      }

      // Create a document on CC
      const channelName = 'tokench'
      const contractName = 'etri-bcdms-token-chaincode'
      const functionName = 'UPDATE_REWARD_VALUE'
      const args = [JSON.stringify({ rewardKind: rewardKindNum, rewardValue: rewardValueNum })]

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

      res.status(200).send({
        success: true,
        message: 'successfully update the reward value',
        payload: response
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to update the reward value',
        payload: err.message
      })
    }
  }
}
