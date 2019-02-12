
import log4js = require('log4js')
import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import { User, UserOptions } from 'fabric-client'
import DAppFabricClient from './dapp-fabric-client'
import config from './config'
import { logToUserPersistence, logFromUserPersistence, logToCA, logFromCA } from './sdk-logger'

const logger = log4js.getLogger('GatewayFabricUser')
logger.setLevel('DEBUG')

export async function registerUser(
  orgName: string,
  departmentName: string,
  userName: string,
  password: string
): Promise<void> {
  DAppFabricClient.switchCryptoSuite(orgName)
  DAppFabricClient.switchStateStore(orgName)

  // get the Admin and use it to enroll the user
  try {
    const adminUserObj = await getAdminUser(orgName)
    const caClient = DAppFabricClient.getCA(orgName)

    logToCA(true, orgName, userName)
    await caClient.register(
      {
        enrollmentID: userName,
        enrollmentSecret: password,
        affiliation: `${orgName}.${departmentName}`,
        maxEnrollments: -1
      },
      adminUserObj
    )
    logFromCA(true, true)
  } catch (err) {
    logFromCA(false, false)
    throw err
  }
}

export async function loginUser(
  orgName: string,
  departmentName: string,
  userName: string,
  password: string
): Promise<User> {
  DAppFabricClient.switchCryptoSuite(orgName)
  DAppFabricClient.switchStateStore(orgName)

  // Always communicate with CA
  try {
    // get the Admin and use it to enroll the user
    const adminUserObj = await getAdminUser(orgName)
    const caClient = DAppFabricClient.getCA(orgName)

    logToCA(false, orgName, userName)
    const message = await caClient.enroll({
      enrollmentID: userName,
      enrollmentSecret: password
    })

    if (message && typeof message === 'string' && message.includes('Error:')) {
      logFromCA(false, false)
    }

    logFromCA(false, true)

    const userOptions: UserOptions = {
      username: userName,
      mspid: getMspID(orgName),
      cryptoContent: {
        privateKeyPEM: message.key.toBytes(),
        signedCertPEM: message.certificate
      },
      skipPersistence: false
    }
    return await DAppFabricClient.createUser(userOptions)
  } catch (err) {
    logFromCA(false, false)
    throw err
  }
}

export async function getLoggedInUser(orgName: string, userName: string): Promise<User> {
  DAppFabricClient.switchCryptoSuite(orgName)
  DAppFabricClient.switchStateStore(orgName)

  const user = await DAppFabricClient.getUserContext(userName, true)

  if (user && user.isEnrolled()) {
    return user
  } else {
    throw Error('not logged in')
  }
}

export async function registerAdmin(): Promise<any> {
  const orgConfigList = _.entries(config.data.networkConfig.organizationMap)
  const orgAdminSet = {}

  for (const orgConfigEntry of orgConfigList) {
    const orgName = orgConfigEntry[0]
    const orgConfig = orgConfigEntry[1]

    const userName = orgConfig.admin.userName
    const password = orgConfig.admin.password
    orgAdminSet[orgName] = { userName, password }

    try {
      await registerUser(orgName, 'department1', userName, password)
    } catch (err) {
      if (!err.message.includes('already registered')) {
        // not already registered
        throw err
      }
    }
  }

  return orgAdminSet
}

export async function enrollAdmin(params: any): Promise<any> {
  const username: string = config.data.networkConfig.organizationMap[params.orgName].admin.userName
  const password: string = params.password
  const userOrg: string = params.orgName

  DAppFabricClient.switchStateStore(userOrg)

  const caClient = DAppFabricClient.getCA(userOrg)

  try {
    const enrollment = await caClient.enroll({
      enrollmentID: username,
      enrollmentSecret: password
    })

    logger.info("Successfully enrolled user '" + username + "'")
    const userOptions: UserOptions = {
      username,
      mspid: getMspID(userOrg),
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate
      },
      skipPersistence: false
    }

    const member = await DAppFabricClient.createUser(userOptions)
    return {
      success: true,
      message: `Successfully enrolled user '${username}'`,
      payload: member
    }
  } catch (err) {
    logger.error('Failed to enroll the admin due to error: ' + err.stack ? err.stack : err)

    return {
      success: false,
      message: 'Failed to enroll the admin',
      payload: JSON.stringify(err)
    }
  }
}

export async function getOrgAdmin(userOrg: string): Promise<User> {
  const adminInfo = config.data.networkConfig.organizationMap[userOrg].admin
  const keyPath = path.join(adminInfo.key)
  const keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString()
  const certPath = path.join(adminInfo.cert)
  const certPEM = readAllFiles(certPath)[0].toString()

  if (!userOrg) {
    // TODO: Error handling
  }

  DAppFabricClient.switchCryptoSuite(userOrg)
  DAppFabricClient.switchStateStore(userOrg)

  return DAppFabricClient.createUser({
    username: 'peer' + userOrg + 'Admin',
    mspid: getMspID(userOrg),
    cryptoContent: {
      privateKeyPEM: keyPEM,
      signedCertPEM: certPEM
    },
    skipPersistence: false
  })
}

export function getMspID(orgID: string) {
  const orgInfo = config.data.networkConfig.organizationMap[orgID]

  if (orgInfo) {
    logger.debug('Msp ID : ' + orgInfo.mspID)
    return orgInfo.mspID
  }

  return undefined
}

async function getAdminUser(orgName: string): Promise<User> {
  const userName = config.data.networkConfig.organizationMap[orgName].caAdmin.userName
  const password = config.data.networkConfig.organizationMap[orgName].caAdmin.password

  DAppFabricClient.switchStateStore(orgName)

  // Get the user from the persistence
  try {
    logToUserPersistence(orgName, userName)
    const userObj = await DAppFabricClient.getUserContext(userName, true)
    if (userObj && userObj.isEnrolled()) {
      logFromUserPersistence(true)
      return userObj
    }
  } catch (err) {
    logFromUserPersistence(false)
    throw err
  }
  logFromUserPersistence(false)

  // Enrollment
  try {
    const caClient = DAppFabricClient.getCA(orgName)
    const enrollment = await caClient.enroll({
      enrollmentID: userName,
      enrollmentSecret: password
    })

    const userOptions: UserOptions = {
      username: userName,
      mspid: getMspID(orgName),
      cryptoContent: {
        privateKeyPEM: enrollment.key.toBytes(),
        signedCertPEM: enrollment.certificate
      },
      skipPersistence: false
    }

    logToCA(false, orgName, userName)
    const userObj = await DAppFabricClient.createUser(userOptions)
    logFromCA(false, true)
    return userObj
  } catch (err) {
    logFromCA(false, false)
    throw err
  }
}

function readAllFiles(dir: string) {
  const files = fs.readdirSync(dir)
  const certs: any = []
  files.forEach(fileName => {
    const filePath = path.join(dir, fileName)
    const data = fs.readFileSync(filePath)
    certs.push(data)
  })
  return certs
}
