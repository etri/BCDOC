

import { Peer } from 'fabric-client'
import DAppFabricClient from './dapp-fabric-client'

export function parsePeers(peers: string[]): Peer[] {
  const targets: Peer[] = []
  for (const peer of peers) {
    const splitted = peer.split('-')
    let peerObj: Peer

    try {
      peerObj = parsePeer(peer)
    } catch (e) {
      throw e
    }

    if (peerObj) {
      targets.push(peerObj)
    }
  }

  return targets
}

export function parsePeer(peer: string): Peer {
  const def = parsePeerString(peer)
  const peerObj = DAppFabricClient.getPeer(def.orgName, def.peerName)

  return peerObj
}

export function parsePeerString(peer: string) {
  const splitted = peer.split('-')
  if (splitted.length !== 2) {
    throw new Error('The representation of peer is wrong.')
  }

  const orgName = splitted[0]
  const peerName = splitted[1]

  return { orgName, peerName }
}
