/*
 * Copyright ETRI. All Rights Reserved.
 */

package main

import (
	"fmt"

	cc "bitbucket.org/bigpicturelabs/etri-bcdms-token-chaincode/chaincode"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func main() {
	err := shim.Start(new(cc.TokenInterface))
	if err != nil {
		fmt.Printf("Error starting Evaluation chaincode: %s", err)
	}
}
