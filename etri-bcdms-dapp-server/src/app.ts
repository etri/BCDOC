/*
 * Copyright ETRI. All Rights Reserved.
 */

import log4js = require('log4js')
import * as util from 'util'
import * as http from 'http'
import * as path from 'path'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import cors = require('cors')
import FabricClient = require('fabric-client')
import configureAPI from './api'
import fabricGateway from './blockchain/fabric'
import * as customPath from './custom-path'
import { connectDB } from './db'

const logger = log4js.getLogger('App')

const loadingConfigResult = dotenv.config()
if (loadingConfigResult.error) {
  logger.error('failed to load .env file')
  process.exit(0)
}

connectDB()
  .then(() =>
    fabricGateway.init({
      staticPath: customPath.staticDir,
      rootPath: customPath.rootDir
    })
  )
  .then(orgAdminSet => {
    // create express App
    const port = process.env.PORT
    if (!port) {
      throw Error('no port defined')
    }

    // create a server
    const app = buildExpressApp(orgAdminSet)
    const server = http.createServer(app)
    server.listen(port)
    server.timeout = 240000

    logger.info('****************** SERVER STARTED ******************')
    logger.info('Port: ', port)
  })
  .catch(e => {
    logger.error('Initializing DAppFabricClient has been failed. Aborted.')
    logger.error(e)
    process.exit()
  })

function buildExpressApp(orgAdminSet: any): express.Application {
  const app: express.Application = express()

  app.options('*', cors())
  app.use(cors())
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  app.use(bodyParser.json())

  // configure API routes
  configureAPI(app, fabricGateway, process.env.JWT_SECRET, orgAdminSet)

  return app
}
