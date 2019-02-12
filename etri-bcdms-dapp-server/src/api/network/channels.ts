/*
 * Created on 27 Oct 2018 by Hwi Ahn<hwi.ahn@bigpicturelabs.io>
 *
 * Copyright (c) 2018 bigpicturelabs inc.
 */

import * as express from 'express'
import log4js = require('log4js')
import { IFabricGateway } from '../../blockchain/fabric'

const logger = log4js.getLogger('Api-Network')

export function getCreateChannelHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.info('<<<<<<<<<<<<<<<<< C R E A T E  C H A N N E L >>>>>>>>>>>>>>>>>')

    try {
      const channelName = req.params.channelID
      await gateway.channelManager.create({ channelName })

      logger.debug('==================== INITIALIZE CHAINCODE ==================')

      const args = [req.body.arg]
      const responseOfInitChaincode = await gateway.contractManager.create({
        channelName,
        args
      })

      res.status(200).send({
        success: true,
        message: 'Successfully create the channel',
        payload: responseOfInitChaincode
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to create the channel',
        payload: err
      })
    }
  }
}

export function getUpgradeContractHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.debug('==================== UPGRADE CHAINCODE ==================')

    const channelName = req.params.channelID
    const contractVersion = req.body.contractVersion
    const args = [req.body.arg]

    try {
      const response = await gateway.contractManager.update({
        channelName,
        contractVersion,
        args
      })

      res.status(200).send({
        success: true,
        message: 'Successfully create the channel',
        payload: response
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to upgrade the channel',
        payload: err
      })
    }
  }
}
