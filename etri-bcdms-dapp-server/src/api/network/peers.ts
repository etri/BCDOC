import * as express from 'express'
import log4js = require('log4js')
import { IFabricGateway } from '../../blockchain/fabric'
import * as txDB from '../../db/transaction'
import { logKeyValue } from '../api-logger';

const logger = log4js.getLogger('ApiManagementNetwork')

export function getBlockHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.debug('==================== GET BLOCK BY HEIGHT ==================')

    const { height, peerID } = req.params
    const { channel } = req.query

    try {
      const response = await gateway.channelManager.getBlock({
        peerString: peerID,
        height,
        channelName: channel
      })

      if (response) {
        res.status(200).send({
          success: true,
          message: 'successfully get a block',
          payload: response
        })
      } else {
        res.status(400).send({
          success: false,
          message: 'failed to get a block',
          payload: response
        })
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get a block',
        payload: err
      })
    }
  }
}

export function getTransactionHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.debug('================ GET TRANSACTION BY TRANSACTION_ID ======================')
    const { txID, peerID } = req.params
    const { channel } = req.query

    try {
      const response = await gateway.channelManager.getTx({
        peerString: peerID,
        txID,
        channelName: channel
      })

      if (response) {
        res.status(200).send({
          success: true,
          message: 'successfully get a tx',
          payload: response
        })
      } else {
        res.status(400).send({
          success: false,
          message: 'failed to get a tx',
          payload: response
        })
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get a tx',
        payload: err
      })
    }
  }
}

export function getLastBlockHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.debug('==================== GET BLOCK BY HEIGHT ==================')

    const { peerID } = req.params
    const { channel } = req.query

    try {
      const responseForHeight = await gateway.channelManager.getInfo({
        peerString: peerID,
        channelName: channel
      })

      if (!responseForHeight) {
        throw Error('failed to get the height info')
      }

      const height = responseForHeight.height.low - 1
      const response = await gateway.channelManager.getBlock({
        peerString: peerID,
        height: height.toString(),
        channelName: channel
      })

      if (response) {
        res.status(200).send({
          success: true,
          message: 'successfully get a block',
          payload: response
        })
      } else {
        res.status(400).send({
          success: false,
          message: 'failed to get a block',
          payload: response
        })
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get a block',
        payload: err
      })
    }
  }
}

export function getTransactionListHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    logger.debug('================ GET TRANSACTION LIST ======================')
    const { peerID } = req.params
    const { startIdx, endIdx } = req.query

    try {
      const startIdxNum = Number(startIdx)
      const endIdxNum = Number(endIdx)

      const transactionList = await txDB.readTransactionListWithRange(startIdxNum, endIdxNum)
      logKeyValue('txList: ', transactionList)

      if (transactionList) {
        res.status(200).send({
          success: true,
          message: 'successfully get tx list',
          payload: transactionList
        })
      } else {
        res.status(200).send({
          success: true,
          message: 'successfully get tx list',
          payload: []
        })
      }
    } catch (err) {
      logKeyValue('txListErr: ', err)
      res.status(400).send({
        success: false,
        message: 'failed to get a tx',
        payload: err.message
      })
    }
  }
}
