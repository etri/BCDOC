/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as _ from 'lodash'
import { ContractManager, IFabricContractManager } from './contract-manager'
import { ChannelManager, IFabricChannelManager } from './channel-manager'
import { UserManager, IFabricUserManager } from './user-manager'
import DAppFabricClient from './sdk/dapp-fabric-client'
import config, { convertToRealPath, configType } from './sdk/config'
import { registerAdmin } from './sdk/user'

export interface IInitParams {
  staticPath: string
  rootPath: string
}

export interface IConfig {
  type: string
  path: string
}

export interface IFabricGateway {
  contractManager: IFabricContractManager
  channelManager: IFabricChannelManager
  userManager: IFabricUserManager

  init(params: IInitParams): Promise<void>
}

const fabricGateway: IFabricGateway = {
  contractManager: new ContractManager(),
  channelManager: new ChannelManager(),
  userManager: new UserManager(),
  init: async ({ staticPath, rootPath }: IInitParams): Promise<any> => {
    // Config 셋팅
    convertToRealPath(staticPath)
    _.values(configType).forEach(type => config.addConfigFile(type))

    // DAppFabricClient 셋팅
    await DAppFabricClient.init({ rootPath })

    // Register admin users to CA
    return registerAdmin()
  }
}

export default fabricGateway
