/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"fmt"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (t *TokenInterface) transfer(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.Transfer
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if arg.Amount <= 0 || arg.SourceUserID == "" || arg.TargetUserID == "" || arg.Timestamp <= 0 {
		return sendError(ErrIncorrectArguments, ErrInvalidArguments)
	}

	// Get the source user
	var sourceUserTokenInfo UserTokenInfo
	err = readState(arg.SourceUserID, &sourceUserTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Get the target user
	var targetUserTokenInfo UserTokenInfo
	err = readState(arg.TargetUserID, &targetUserTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Check the balance of the source user
	if sourceUserTokenInfo.Balance < arg.Amount {
		return sendError(ErrIncorrectArguments, ErrInsufficientToken)
	}

	// Create deals
	sourceDeal := &Deal{
		ID:       fmt.Sprintf("%s.%d", arg.SourceUserID, arg.Timestamp),
		Amount:   -1 * arg.Amount,
		Date:     arg.Timestamp,
		TxID:     stub.GetTxID(),
		DealType: object.Deal_TRANSFER,
		RefID:    "",
	}

	targetDeal := &Deal{
		ID:       fmt.Sprintf("%s.%d", arg.TargetUserID, arg.Timestamp),
		Amount:   arg.Amount,
		Date:     arg.Timestamp,
		TxID:     stub.GetTxID(),
		DealType: object.Deal_TRANSFER,
		RefID:    "",
	}

	// Add a deal and calculate the balance
	sourceUserTokenInfo.Balance += sourceDeal.Amount
	sourceUserTokenInfo.History = append([]*Deal{sourceDeal}, sourceUserTokenInfo.History...)

	targetUserTokenInfo.Balance += targetDeal.Amount
	targetUserTokenInfo.History = append([]*Deal{targetDeal}, targetUserTokenInfo.History...)

	// Save to the blockchain
	err = writeState(sourceUserTokenInfo.ID, sourceUserTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	err = writeState(targetUserTokenInfo.ID, targetUserTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.Transfer{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}
