

import * as log4js from 'log4js'

const logger = log4js.getLogger('FabricSDK')
logger.setLevel('DEBUG')

export function logFncEnter(fnc: string, args: any) {
  logger.debug('==================== Call SDK Connector ====================')
  logger.debug('Function Name: ', fnc)
  logger.debug('Arguments: ', args)
}

export function logToNetwork(destination: string, args: any) {
  logger.debug('****** Send to the Fabric Network ******')
  logger.debug('Destination: ', destination)
  logger.debug('Arguments: ', args)
}

export function logFromNetwork(departure: string, args: any, success: boolean) {
  if (success) {
    logger.debug('****** Recieving from the Fabric Network ******')
    logger.debug('Departure: ', departure)
    logger.debug('Arguments: ', args)
  } else {
    logger.error('****** (Error!) Recieving from the Fabric Network ******')
    logger.error('Departure: ', departure)
    logger.error('Arguments: ', args)
  }
}

export function logToUserPersistence(orgName: string, userName: string) {
  logger.debug('****** Try to read the user from the persistence ******')
  logger.debug('Organization: ', orgName)
  logger.debug('User: ', userName)
}

export function logFromUserPersistence(exists: boolean) {
  if (exists) {
    logger.debug('****** Read the user from the persistence ******')
  } else {
    logger.debug('****** Not enrolled user on this machine ******')
  }
}

export function logToCA(isRegister: boolean, orgName: string, userName: string) {
  if (isRegister) {
    logger.debug('****** Try to register the user to CA ******')
    logger.debug('Organization: ', orgName)
    logger.debug('User: ', userName)
  } else {
    logger.debug('****** Try to enroll the user to CA ******')
    logger.debug('Organization: ', orgName)
    logger.debug('User: ', userName)
  }
}

export function logFromCA(isRegister: boolean, success: boolean) {
  const fnc = isRegister ? 'Registration' : 'Enrollment'
  if (success) {
    logger.debug(`****** Successful ${fnc} from the CA ******`)
  } else {
    logger.debug(`****** Failed ${fnc} from the CA ******`)
  }
}
