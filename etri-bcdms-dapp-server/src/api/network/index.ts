/*
 * Created on 15 Oct 2018 by Hwi Ahn<hwi.ahn@bigpicturelabs.io>
 *
 * Copyright (c) 2018 bigpicturelabs inc.
 */

import * as express from 'express'
import { IFabricGateway } from '../../blockchain/fabric'
import * as peers from './peers'
import * as channels from './channels'

const GET_BLOCK = '/network/peers/:peerID/block/:height'
const GET_TRANSACTION = '/network/peers/:peerID/tx/:txID'
const GET_LASTBLOCK = '/network/peers/:peerID/last-block'
const GET_TRANSACTIONLIST = '/network/peers/:peerID/tx'

// For local testing
const CREATE_CHANNEL = '/network/channels/:channelID'
const UPGRADE_CONTRACT = '/network/channels/:channelID/contract'

export default function configure(app: express.Application, gateway: IFabricGateway) {
  app.get(GET_BLOCK, peers.getBlockHandler(gateway))
  app.get(GET_TRANSACTION, peers.getTransactionHandler(gateway))
  app.get(GET_LASTBLOCK, peers.getLastBlockHandler(gateway))
  app.get(GET_TRANSACTIONLIST, peers.getTransactionListHandler(gateway))

  // For local testing
  app.post(CREATE_CHANNEL, channels.getCreateChannelHandler(gateway))
  app.post(UPGRADE_CONTRACT, channels.getUpgradeContractHandler(gateway))
}
