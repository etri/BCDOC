

import * as _ from 'lodash'
import * as path from 'path'
import * as fs from 'fs'

export interface IDAppServerConfig {
  networkConfig: INetworkConfig
}

export interface INetworkConfig {
  ordererMap: { [ordererName: string]: IOrdererConfig }
  organizationMap: { [orgName: string]: IOrganizationConfig }
  channelMap: { [channelName: string]: IChannelConfig }
}

export interface IOrdererConfig {
  url: string
  host: string
  tlsCACerts: string
}

export interface IOrganizationConfig {
  name: string
  mspID: string
  caURL: string
  caAdmin: { userName: string; password: string }
  peerMap: { [peerName: string]: IPeerConfig }
  admin: {
    userName: string
    password: string
    key: string
    cert: string
  }
}

export interface IPeerConfig {
  requestsURL: string
  eventsURL: string
  host: string
  tlsCACerts: string
}

export interface IChannelConfig {
  organizationMap: { [orgName: string]: { endorserIDList: string[] } }
  'endorsement-policy': {
    identities: Array<{ role: { name: string; mspId: string } }>
    policy: { '2-of': Array<{ 'signed-by': number }> }
  }
  chaincode: {
    name: string
    path: string
    version: string
  }
}

// Path 경로
export const rootPath = {
  config: 'config',
  keys: 'keys',
  channelArtifacts: 'channel-artifacts'
}

let isRealizedPath = false
export function convertToRealPath(staticPath: string) {
  _.keys(rootPath).forEach(key => {
    rootPath[key] = path.join(staticPath, rootPath[key])
  })

  isRealizedPath = true
}

const configFile = {
  ordererMap: 'orderers.json',
  organizationMap: 'organizations.json',
  channelMap: 'channels.json'
}

export const configType = {
  ordererMap: 'ordererMap',
  organizationMap: 'organizationMap',
  channelMap: 'channelMap'
}

export interface IIUpdateChaincodeVersion {
  channelName: string
  chaincodeVersion: string
}

export class Config {
  public data: IDAppServerConfig = {
    networkConfig: {
      ordererMap: {},
      organizationMap: {},
      channelMap: {}
    }
  }

  public addConfigFile(type: string) {
    const configTypeList = _.values(configType)
    if (!_.includes(configTypeList, type)) {
      throw Error('wrong config type')
    }

    if (!isRealizedPath) {
      throw Error('config paths are not realized yet')
    }

    const raw = fs.readFileSync(path.join(rootPath.config, configFile[type]))
    const newConfig = JSON.parse(raw.toString())

    this.data.networkConfig[type] = newConfig

    // relative path를 actual path로 변경
    if (type === configType.organizationMap) {
      _.keys(this.data.networkConfig[type]).forEach(orgName => {
        const orgConfig: IOrganizationConfig = this.data.networkConfig[type][orgName]
        _.keys(orgConfig.peerMap).forEach(peerName => {
          orgConfig.peerMap[peerName].tlsCACerts = this.getRealPath(
            orgConfig.peerMap[peerName].tlsCACerts
          )
        })
        orgConfig.admin.key = this.getRealPath(orgConfig.admin.key)
        orgConfig.admin.cert = this.getRealPath(orgConfig.admin.cert)
      })
    } else if (type === configType.ordererMap) {
      _.keys(this.data.networkConfig[type]).forEach(ordererName => {
        const ordererConfig: IOrdererConfig = this.data.networkConfig[type][ordererName]
        ordererConfig.tlsCACerts = this.getRealPath(ordererConfig.tlsCACerts)
      })
    }
  }

  public updateChaincodeVersion({
    channelName,
    chaincodeVersion
  }: IIUpdateChaincodeVersion): boolean {
    const channelConfig = this.data.networkConfig.channelMap
    if (!channelConfig[channelName]) {
      return false
    }

    channelConfig[channelName].chaincode.version = chaincodeVersion

    const channelConfigPath = path.join(rootPath.config, configFile.channelMap)

    try {
      fs.writeFileSync(channelConfigPath, JSON.stringify(channelConfig))
    } catch (e) {
      return false
    }

    return true
  }

  private getRealPath(relativePath: string): string {
    return path.join(rootPath.keys, relativePath)
  }
}

export default new Config()
