/*
 * Copyright ETRI. All Rights Reserved.
 */
 
 import log4js = require('log4js')

const logger = log4js.getLogger('DB')
logger.setLevel('DEBUG')

export function logDBConnect(dbName: string, dbURI: string) {
  logger.debug('==================== Connect DB ====================')
  logger.debug('DB Name: ', dbName)
  logger.debug('DB URI: ', dbURI)
}

export function logDBWrite(dbName: string, collection: string, args: any) {
  logger.debug('==================== Writes on DB ====================')
  logger.debug('DB Name: ', dbName)
  logger.debug('Collection: ', collection)
  logger.debug('Args: ', args)
}

export function logDBRead(dbName: string, collection: string, key: string | string[]) {
  logger.debug('==================== Reads on DB ====================')
  logger.debug('DB Name: ', dbName)
  logger.debug('Collection: ', collection)
  logger.debug('Key: ', key)
}

export function logError(message: string, error: Error) {
  logger.error('Error: ', message)
  logger.error('Details: ', error)
}
