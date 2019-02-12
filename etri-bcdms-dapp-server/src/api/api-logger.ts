/*
 * Copyright ETRI. All Rights Reserved.
 */

import log4js = require('log4js')

const logger = log4js.getLogger('API')
logger.setLevel('DEBUG')

export function logAPIEnter(apiName: string, apiPath: string, params: any) {
  logger.debug('==================== Call API ====================')
  logger.debug('API Name: ', apiName)
  logger.debug('API Path: ', apiPath)
  logger.debug('API Params: ', params)
}

export function logAPIError(apiName: string, apiPath: string, err: Error) {
  logger.error('API Name: ', apiName)
  logger.error('API Path: ', apiPath)
  logger.error('Error: ', err)
}

export function logEnterJWT(path: string) {
  logger.debug('****** Handle the JWT ******')
  logger.debug('API Path: ', path)
}

export function logExitJWT(orgName: string, userName: string) {
  logger.debug('****** Success to verify the JWT ******')
  logger.debug('Org name: ', orgName)
  logger.debug('User name: ', userName)
}

export function logErrorJWT(err: Error) {
  logger.debug('****** Failed to verify the JWT ******')
  logger.error('Error: ', err)
}

export function logKeyValue(key: string, value: string) {
  logger.debug(`${key}: `, value)
}
