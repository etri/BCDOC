/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
)

func existsOnState(key string, stub shim.ChaincodeStubInterface) bool {
	valueBytes, err := stub.GetState(key)
	if err != nil {
		return false
	}
	if valueBytes == nil {
		return false
	}

	return true
}

func readState(key string, value interface{}, stub shim.ChaincodeStubInterface) error {
	valueBytes, err := stub.GetState(key)

	logReadState(key, valueBytes)

	if err != nil {
		return err
	}
	if valueBytes == nil {
		return ErrNoSuchItem
	}

	err = json.Unmarshal(valueBytes, value)
	if err != nil {
		return err
	}

	return nil
}

func writeState(key string, value interface{}, stub shim.ChaincodeStubInterface) error {
	valueBytes, err := json.Marshal(value)

	logWriteState(key, valueBytes)

	if err != nil {
		return err
	}

	err = stub.PutState(key, valueBytes)
	if err != nil {
		return err
	}

	return nil
}
