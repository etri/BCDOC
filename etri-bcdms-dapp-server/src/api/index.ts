/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as express from 'express'
import configureTokenAPI from './token'
import configureNetworkMgmtAPI from './network'
import configureUserAPI from './user'
import configureDocumentAPI from './document'
import configureAdminAPI from './admin'
import { configureJWT } from './jwt'
import { IFabricGateway } from '../blockchain/fabric'

export default function configureAPI(
  app: express.Application,
  gateway: IFabricGateway,
  jwtSecret: string,
  orgAdminSet: any
) {
  console.log(orgAdminSet)

  configureTokenAPI(app, gateway)
  configureNetworkMgmtAPI(app, gateway)
  configureDocumentAPI(app, gateway)
  configureUserAPI(app, gateway)
  configureAdminAPI(app, gateway)
  configureJWT(jwtSecret, orgAdminSet)
}
