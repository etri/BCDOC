#!/usr/bin/env bash

# remove remaining artifacts
rm -rf crypto-config genesis.block reputationch.tx credencech.tx
echo "*****remove remaining artifacts\n"

# generate crypto-related artifacts
cryptogen generate --config=./crypto-config.yaml
echo "*****generate crypto-related artifacts\n"

# set FABRIC_CFG_PATH as infra directory
export FABRIC_CFG_PATH=.

# generate the genesis block for the reputation channel
configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./genesis.block
echo "*****generate the genesis block for the orderer bootstraping\n"

# generate the channel configuration transaction for creating the reputation channel
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./reputationch.tx -channelID reputationch
echo "*****generate the channel configuration transaction for creating the reputation channel\n"

## generate the channel configuration transaction to update the anchor channel
#configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchorsreputationch.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
#echo "*****generate the channel configuration transaction to update the anchor for Org1\n"
#
#configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchorsreputationch.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
#echo "*****generate the channel configuration transaction to update the anchor for Org2\n"

# generate the channel configuration transaction for creating the credence channel
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./credencech.tx -channelID credencech
echo "*****generate the channel configuration transaction for creating the credence channel\n"

## generate the channel configuration transaction to update the anchor channel
#configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org1MSPanchorscredencech.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
#echo "*****generate the channel configuration transaction to update the anchor for Org1\n"
#
#configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./channel-artifacts/Org2MSPanchorscredencech.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
#echo "*****generate the channel configuration transaction to update the anchor for Org2\n"