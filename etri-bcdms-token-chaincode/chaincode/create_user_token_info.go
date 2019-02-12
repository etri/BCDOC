/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (t *TokenInterface) createUserTokenInfo(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.CreateUserTokenInfo
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if arg.UserID == "" || arg.UserName == "" {
		return sendError(ErrIncorrectArguments, ErrNilUserIDOrName)
	}

	// Check if already existsOnState
	if ok := existsOnState(arg.UserID, stub); ok {
		return sendError(ErrIncorrectArguments, ErrAlreadyExistingUser)
	}

	// Create the object
	userTokenInfo := newUserTokenInfo(arg.UserID, arg.UserName)

	// Save to the blockchain
	err = writeState(userTokenInfo.ID, userTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.CreateUserTokenInfo{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}
