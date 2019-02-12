/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as _ from 'lodash'
import * as log4js from 'log4js'
import * as userCC from './sdk/user-chaincode'
import * as systemCC from './sdk/system-chaincode'
import * as peer from './sdk/peer'
import config from './sdk/config'

const logger = log4js.getLogger('ContractManager')
logger.setLevel('DEBUG')

const createType = {
  install: 'install',
  instantiate: 'instantiate'
}

export interface IFabricContractManager {
  create(params: ICreateParams): Promise<string>
  update(params: IUpdateParams): Promise<string>
  invoke(params: IInvokeParams): Promise<string>
  query(params: IQueryParams): Promise<string>
}

export interface ICreateParams {
  channelName: string
  args?: string[]
}

export interface IUpdateParams {
  channelName: string
  contractVersion: string
  args: string[]
}

export interface IInvokeParams {
  channelName: string
  contractName: string
  functionName: string
  args: string[]
  userName?: string
  orgName?: string
  isAdmin: boolean
}

export interface IQueryParams {
  peerID: string
  channelName: string
  contractName: string
  functionName: string
  args: string[]
  orgName: string
}

export class ContractManager implements IFabricContractManager {
  public async create({ args, channelName }: ICreateParams): Promise<string> {
    if (!channelName || !args) {
      throw Error('insufficient parameters')
    }

    const channelConfig = config.data.networkConfig.channelMap[channelName]
    if (!channelConfig) {
      throw Error('no such channel')
    }

    const chaincodeName = channelConfig.chaincode.name
    const chaincodeVersion = channelConfig.chaincode.version
    const orgList = _.keys(channelConfig.organizationMap)

    await installChaincode({
      channelName,
      chaincodeName,
      chaincodeVersion,
      orgList
    })

    return await systemCC.instantiateChaincode({
      chaincodeId: chaincodeName,
      chaincodeVersion,
      channelName,
      args,
      orgName: orgList[0],
      isUpgrade: false
    })
  }

  public async update({ channelName, contractVersion, args }: IUpdateParams): Promise<string> {
    if (!channelName || !contractVersion || !args) {
      throw Error('insufficient parameters')
    }

    const channelConfig = config.data.networkConfig.channelMap[channelName]
    if (!channelConfig) {
      throw Error('no such channel')
    }

    const chaincodeName = channelConfig.chaincode.name
    const chaincodeVersion = contractVersion
    const orgList = _.keys(channelConfig.organizationMap)

    // Install first
    await installChaincode({
      channelName,
      chaincodeName,
      chaincodeVersion,
      orgList
    })

    // Upgrade(same with instantiate) second
    const response = await systemCC.instantiateChaincode({
      chaincodeId: chaincodeName,
      chaincodeVersion,
      channelName,
      args,
      orgName: orgList[0],
      isUpgrade: true
    })

    config.updateChaincodeVersion({ channelName, chaincodeVersion })

    return response
  }

  public invoke({
    channelName,
    contractName,
    functionName,
    args,
    userName,
    orgName,
    isAdmin
  }: IInvokeParams): Promise<string> {
    logger.debug(`====Invoke a function ${functionName}====`)
    logger.debug('args: ', args)
    if (!(channelName && contractName && functionName && args)) {
      throw Error('insufficient parameters')
    }

    if (!isAdmin && (!userName || !orgName)) {
      throw Error('insufficient parameters')
    }

    return userCC.invoke({
      channelName,
      chaincodeId: contractName,
      functionName,
      args,
      userName,
      orgName,
      isAdmin
    })
  }

  public query({
    peerID,
    channelName,
    contractName,
    functionName,
    args,
    orgName
  }: IQueryParams): Promise<string> {
    if (!(peerID && channelName && contractName && args && functionName && orgName)) {
      throw Error('insufficient parameters')
    }
    return userCC.query({
      peerID,
      channelName,
      chaincodeId: contractName,
      args,
      functionName,
      orgName
    })
  }
}

interface IInstallChaincode {
  channelName: string
  chaincodeName: string
  chaincodeVersion: string
  orgList: string[]
}

async function installChaincode({
  channelName,
  chaincodeName,
  chaincodeVersion,
  orgList
}: IInstallChaincode) {
  const channelConfig = config.data.networkConfig.channelMap[channelName]

  for (const orgName of orgList) {
    const chaincodePath = channelConfig.chaincode.path

    const orgConfig = config.data.networkConfig.organizationMap[orgName]
    if (!orgConfig) {
      throw Error('no such organization')
    }

    const peerIDList = _.keys(orgConfig.peerMap)
    await peer.installChaincode({
      orgName,
      peerIDList,
      chaincodeName,
      chaincodeVersion,
      chaincodePath
    })
  }
}
