

import * as path from 'path'
import * as fs from 'fs'
import * as _ from 'lodash'
import * as log4js from 'log4js'
import * as FabricClient from 'fabric-client'
import config, { IPeerConfig, configType, convertToRealPath } from './config'

// tslint:disable-next-line:no-var-requires
const FabricCAClient = require('fabric-ca-client')

const logger = log4js.getLogger('DAppFabricClient')
logger.setLevel('DEBUG')

interface ClientStore {
  cryptoSuite: FabricClient.ICryptoSuite
  stateStore: FabricClient.IKeyValueStore
}

interface PeerSet {
  [orgID: string]: {
    [peerID: string]: {
      peer: FabricClient.Peer
      eventhub: FabricClient.EventHub
    }
  }
}

interface ChannelSet {
  [channelName: string]: FabricClient.Channel
}

interface CASet {
  [orgID: string]: any // FabricCAClient 객체
}

interface StoreSet {
  [orgID: string]: ClientStore
}

export interface IInitParams {
  rootPath: string
}

export class DAppFabricClient extends FabricClient {
  private ordererList: FabricClient.Orderer[] = []
  private peerSet: PeerSet = {}
  private channelSet: ChannelSet = {}

  // TODO: CA 단위로 바꾸기 (현재는 Org 1개당 무조건 CA 1개.)
  private caSet: CASet = {}
  private storeSet: StoreSet = {}

  private rootPath: string

  public async init({ rootPath }: IInitParams) {
    if (!rootPath) {
      throw Error('insufficient parameters')
    }

    this.rootPath = rootPath

    await this.initPeersCAsStoresPerOrg()
    this.initOrderer()
    this.initChannels()
  }

  public buildChannelObject(
    channelName: string,
    participantPeerIDList: Array<{ orgID: string; peerID: string }>
  ): FabricClient.Channel {
    const channel = this.newChannel(channelName)
    for (const orderer of this.ordererList) {
      // (From SDK document: addOrderer)
      // * Add the orderer object to the channel object, this is a client-side-only operation.
      // * An application may add more than one orderer object to the channel object, however
      // * the SDK only uses the first one in the list to send broadcast messages to the
      // * orderer backend.
      channel.addOrderer(orderer)
    }

    for (const peerInfo of participantPeerIDList) {
      const orgID = peerInfo.orgID
      const peerID = peerInfo.peerID

      if (this.peerSet[orgID] && this.peerSet[orgID][peerID]) {
        const peer = this.peerSet[orgID][peerID].peer
        channel.addPeer(peer)
      } else {
        logger.error('There is no such organization or peer')
      }
    }

    this.channelSet[channelName] = channel

    logger.debug(`Successfully created the Channel object for ${channelName}`)
    return channel
  }

  public getPeer(orgID: string, peerID: string): FabricClient.Peer {
    if (this.peerSet[orgID] && this.peerSet[orgID][peerID]) {
      return this.peerSet[orgID][peerID].peer
    }

    return undefined
  }

  public getPeers(orgID: string): FabricClient.Peer[] {
    if (this.peerSet[orgID]) {
      const peerList = _.values(this.peerSet[orgID])
      return peerList.filter(peerInfo => peerInfo.peer !== undefined).map(peerInfo => peerInfo.peer)
    }

    return undefined
  }

  public getEventHubForPeer(orgID: string, peerID: string): FabricClient.EventHub {
    if (this.peerSet[orgID] && this.peerSet[orgID][peerID]) {
      return this.peerSet[orgID][peerID].eventhub
    }

    return undefined
  }

  public getCA(orgID: string): any {
    return this.caSet[orgID]
  }

  public getChannel(channelName: string): FabricClient.Channel {
    return this.channelSet[channelName]
  }

  public getOrderers(): FabricClient.Orderer[] {
    return this.ordererList
  }

  public switchCryptoSuite(orgID: string) {
    const cryptoSuite = this.storeSet[orgID].cryptoSuite
    this.setCryptoSuite(cryptoSuite)
  }

  public switchStateStore(orgID: string) {
    const stateStore = this.storeSet[orgID].stateStore
    this.setStateStore(stateStore)
  }

  public getEndorsingPeerList(channelName: string): FabricClient.Peer[] {
    // Get the channel configuration
    const channelConfig = config.data.networkConfig.channelMap[channelName]
    if (!channelConfig) {
      throw Error('no such channel')
    }

    const targets: FabricClient.Peer[] = []
    _.keys(channelConfig.organizationMap).forEach(orgName => {
      const endorserIDList = channelConfig.organizationMap[orgName].endorserIDList

      Array.prototype.push.apply(
        targets,
        endorserIDList.map(peerID => this.getPeer(orgName, peerID))
      )
    })

    return targets
  }

  private initOrderer() {
    _.keys(config.data.networkConfig.ordererMap).forEach(ordererName => {
      const ordererConfig = config.data.networkConfig.ordererMap[ordererName]
      const caRootsPath = ordererConfig.tlsCACerts
      const data = fs.readFileSync(caRootsPath)
      const caroots = Buffer.from(data).toString()

      const orderer = this.newOrderer(ordererConfig.url, {
        pem: caroots,
        'ssl-target-name-override': ordererConfig.host
      })

      this.ordererList.push(orderer)
    })
  }

  private async initPeersCAsStoresPerOrg() {
    const organizationMap = config.data.networkConfig.organizationMap
    for (const key in organizationMap) {
      if (key.indexOf('org') === 0) {
        const orgID = key
        const caURL = organizationMap[orgID].caURL

        await this.initStores(orgID)
        this.initCA(orgID, caURL)
        this.initPeers(orgID, organizationMap[orgID].peerMap)
      }
    }
  }

  private async initStores(orgID: string) {
    const filebasedStorePath = this.getFileBasedStorePath(orgID)
    const cryptoSuite = FabricClient.newCryptoSuite()
    cryptoSuite.setCryptoKeyStore(
      FabricClient.newCryptoKeyStore({
        path: filebasedStorePath
      })
    )

    try {
      const stateStore = await FabricClient.newDefaultKeyValueStore({
        path: filebasedStorePath
      })

      this.storeSet[orgID] = { cryptoSuite, stateStore }
    } catch (e) {
      logger.error(
        `Initializing stores has been failed because of the error: ${e.stack ? e.stack : e.message}`
      )
    }
  }

  private initCA(orgID: string, caURL: string) {
    const ca = new FabricCAClient(caURL, null, '', this.storeSet[orgID].cryptoSuite)

    this.caSet[orgID] = ca
  }

  private initPeers(orgID: string, peers: { [peerName: string]: IPeerConfig }) {
    for (const peerID in peers) {
      if (peerID) {
        const peerInfo = peers[peerID]
        const tlsCACerts = fs.readFileSync(peerInfo.tlsCACerts)
        const grpcOpts = {
          pem: Buffer.from(tlsCACerts).toString(),
          'ssl-target-name-override': peerInfo.host
        }

        const peer = this.newPeer(peerInfo.requestsURL, grpcOpts)
        peer.setName(peerID)

        const eventhub = this.newEventHub()
        eventhub.setPeerAddr(peerInfo.eventsURL, grpcOpts)

        if (this.peerSet[orgID]) {
          this.peerSet[orgID][peerID] = { peer, eventhub }
        } else {
          this.peerSet[orgID] = { [peerID]: { peer, eventhub } }
        }
      }
    }
  }

  private initChannels() {
    const channelMap = config.data.networkConfig.channelMap
    const channelNameList = _.keys(channelMap)

    for (const channelName of channelNameList) {
      const orgNameList = _.keys(channelMap[channelName].organizationMap)
      const participantPeerIDList: Array<{ orgID: string; peerID: string }> = []

      for (const orgName of orgNameList) {
        const orgPeerIDList = _
          .keys(config.data.networkConfig.organizationMap[orgName].peerMap)
          .map(peerID => {
            return { orgID: orgName, peerID }
          })

        participantPeerIDList.push(...orgPeerIDList)
      }

      // TODO: channelSet에 지정하는건 밖으로 빼기
      this.buildChannelObject(channelName, participantPeerIDList)
    }
  }

  private getFileBasedStorePath(orgID: string) {
    const dirname = `fabric-client-kvs_${orgID}`

    return path.join(this.rootPath, dirname)
  }
}

export default new DAppFabricClient()
