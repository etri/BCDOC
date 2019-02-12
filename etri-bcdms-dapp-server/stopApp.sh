#!/bin/bash
#
# Created on 24 Oct 2018 by Hwi Ahn<hwi.ahn@bigpicturelabs.io>
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

#teardown the network and clean the containers and intermediate images
docker-compose -f ./_artifacts/docker-compose.yaml down
dkcl
dkrm

#Cleanup the material
rm -rf ./fabric-client-kvs_org*
rm -rf ./_artifacts/fabric-ca-server-org1 ./_artifacts/fabric-ca-server-org2
rm -rf ./_artifacts/db/*
