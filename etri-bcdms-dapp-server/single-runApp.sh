#!/bin/bash
#
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#


function dkcl(){
        CONTAINER_IDS=$(docker ps -aq)
	echo
        if [ -z "$CONTAINER_IDS" -o "$CONTAINER_IDS" = " " ]; then
                echo "========== No containers available for deletion =========="
        else
                docker rm -f $CONTAINER_IDS
        fi
	echo
}

function dkrm(){
        DOCKER_IMAGE_IDS=$(docker images | grep "dev\|none\|test-vp\|peer[0-9]-" | awk '{print $3}')
	echo
        if [ -z "$DOCKER_IMAGE_IDS" -o "$DOCKER_IMAGE_IDS" = " " ]; then
		echo "========== No images available for deletion ==========="
        else
                docker rmi -f $DOCKER_IMAGE_IDS
        fi
	echo
}

function restartNetwork() {
	echo

        #teardown the network and clean the containers and intermediate images
	docker-compose -f ./_artifacts/docker-compose.yaml down
	dkcl
	dkrm

	#Cleanup the material
	# TODO: fabric-client-kvs 폴더 위치 루트로 변경
	rm -rf ./fabric-client-kvs_org*
	rm -rf ./_artifacts/fabric-ca-server-org1 ./_artifacts/fabric-ca-server-org2
	rm -rf ./_artifacts/db/*

	#Start the network
	docker-compose -f ./_artifacts/docker-compose.yaml up -d
	echo
}

restartNetwork

PORT=4000 ./node_modules/.bin/ts-node ./src/app.ts
