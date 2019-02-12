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

const rewardValueKeyPrefix = "rewrard-value-key"

func (t *TokenInterface) giveReward(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.GiveReward
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if ok := validateInputArguments(&arg); !ok {
		return sendError(ErrIncorrectArguments, ErrEmptyValueOfArguments)
	}

	// Get the user
	var userTokenInfo UserTokenInfo
	err = readState(arg.UserID, &userTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Get the reward value
	key, err := stub.CreateCompositeKey(rewardValueKeyPrefix, []string{strconv.Itoa(int(arg.Deal.DealType))})
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	valueBytes, err := stub.GetState(key)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}
	rewardValueString := string(valueBytes[:])
	rewardValue, err := strconv.Atoi(rewardValueString)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Add a deal
	deal := &Deal{
		ID: arg.Deal.Id,
		// Amount:   arg.Deal.Amount,
		Amount:   int32(rewardValue),
		Date:     arg.Deal.Date,
		TxID:     arg.Deal.TxID,
		DealType: arg.Deal.DealType,
		RefID:    arg.Deal.RefID,
	}
	userTokenInfo.History = append([]*Deal{deal}, userTokenInfo.History...)

	// Get the central bank
	var cbTokenInfo UserTokenInfo
	err = readState(centralBankKey, &cbTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// balance calculation: deduct from the central bank to the user
	cbTokenInfo.Balance -= deal.Amount
	userTokenInfo.Balance += deal.Amount

	// Save to the blockchain
	err = writeState(userTokenInfo.ID, userTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	err = writeState(centralBankKey, cbTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.GiveReward{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func validateInputArguments(arg *contr_args.GiveReward) bool {
	return !(arg.UserID == "" ||
		arg.Deal == nil ||
		arg.Deal.RefID == "" ||
		arg.Deal.TxID == "" ||
		arg.Deal.Date <= 0 ||
		arg.Deal.DealType > 3 ||
		arg.Deal.DealType < 0)
}
