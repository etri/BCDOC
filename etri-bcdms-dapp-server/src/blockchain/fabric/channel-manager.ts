/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as _ from 'lodash'
import { Block, BlockchainInfo } from 'fabric-client'
import * as systemCC from './sdk/system-chaincode'
import * as peer from './sdk/peer'
import * as query from './sdk/query'
import config from './sdk/config'

export interface IFabricChannelManager {
  create(params: ICreateParams): Promise<void>
  update(params: IUpdateParams): Promise<void>
  getTx(params: IGetTxParams): Promise<any>
  getBlock(params: IGetBlockParams): Promise<Block>
  getInfo(params: IGetInfo): Promise<BlockchainInfo>
}

export interface ICreateParams {
  channelName: string
}

const updateType = {
  join: 'join'
}

export interface IUpdateParams {
  channelName: string
  orgName: string
  type: 'join'
  peerIDList: string[]
}

export interface IGetTxParams {
  peerString: string
  txID: string
  channelName: string
}

export interface IGetBlockParams {
  peerString: string
  height: string
  channelName: string
}

export interface IGetInfo {
  peerString: string
  channelName: string
}

export class ChannelManager implements IFabricChannelManager {
  public async create({ channelName }: ICreateParams): Promise<void> {
    // Check ChannelManager parameters
    if (!channelName) {
      throw Error('no required parameters')
    }

    const channelConfig = config.data.networkConfig.channelMap[channelName]

    // Use the first org to create a channel
    const orgName = _.keys(channelConfig.organizationMap)[0]

    // Call SDK
    await systemCC.create({ channelName, orgName })

    // Wait 5 seconds
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    await sleep(5000)

    const orgList = _.keys(config.data.networkConfig.channelMap[channelName].organizationMap)

    for (const orgID of orgList) {
      const peerIDList = _.keys(config.data.networkConfig.organizationMap[orgID].peerMap)

      await peer.joinChannel({
        channelName,
        peerIDList,
        orgName: orgID
      })
    }
  }

  // Channel의 상태를 변경한다.
  // - join: channel에 합류한 peer 리스트에 추가
  // - instantiate: channel에서 contract을 활성화
  public async update({ channelName, orgName, type, peerIDList }: IUpdateParams): Promise<void> {
    // Check ChannelManager parameters
    const updateTypeList = [updateType.join]
    if (!_.includes(updateTypeList, type)) {
      throw Error('wrong update type')
    }

    if (!(channelName && orgName && type && peerIDList)) {
      throw Error('no required parameters')
    }

    switch (type) {
      case updateType.join:
        return peer.joinChannel({ channelName, peerIDList, orgName })
      default:
        throw Error('wrong update type')
    }
  }

  public getTx(params: IGetTxParams): Promise<any> {
    return query.getTransactionByID(params)
  }

  public getBlock(params: IGetBlockParams): Promise<Block> {
    return query.getBlockByNumber(params)
  }

  public async getInfo(params: IGetInfo): Promise<BlockchainInfo> {
    return query.getChannelInfo(params)
  }
}
