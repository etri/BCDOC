/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"strconv"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (t *TokenInterface) updateRewardValue(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.UpdateRewardValue
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if arg.RewardKind < 0 || arg.RewardKind > 2 || arg.RewardValue < 0 {
		return sendError(ErrIncorrectArguments, ErrInvalidArguments)
	}

	// Get the reward record
	key, err := stub.CreateCompositeKey(rewardValueKeyPrefix, []string{strconv.Itoa(int(arg.RewardKind))})
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Save it
	err = stub.PutState(key, []byte(strconv.Itoa(int(arg.RewardValue))))
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.UpdateRewardValue{
		TxID:        stub.GetTxID(),
		RewardKind:  arg.RewardKind,
		RewardValue: arg.RewardValue,
	}
	return sendTheResult(payload)
}
