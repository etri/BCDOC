/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func (t *TokenInterface) getUserTokenInfo(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.GetUserTokenInfo
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if arg.UserID == "" || arg.EndIdx < arg.StartIdx || arg.EndIdx < 0 || arg.StartIdx < 0 {
		return sendError(ErrIncorrectArguments, ErrInvalidArguments)
	}

	// Get the user
	var userTokenInfo UserTokenInfo
	err = readState(arg.UserID, &userTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Get the history
	dealList := make([]*Deal, 0)
	historyLength := int32(len(userTokenInfo.History))
	if arg.StartIdx < historyLength {
		if arg.EndIdx > historyLength {
			// EndIdx가 길이 보다 길 경우, 끝까지 반환
			dealList = userTokenInfo.History[arg.StartIdx:]
		} else {
			dealList = userTokenInfo.History[arg.StartIdx:arg.EndIdx]
		}
	}

	dealObjList := make([]*object.Deal, 0)
	for _, deal := range dealList {
		dealObj := &object.Deal{
			Id:       deal.ID,
			Amount:   deal.Amount,
			Date:     deal.Date,
			TxID:     deal.TxID,
			DealType: deal.DealType,
			RefID:    deal.RefID,
		}

		dealObjList = append(dealObjList, dealObj)
	}

	// Create the object
	userTokenInfoObj := &object.UserTokenInfo{
		Id:      userTokenInfo.ID,
		Name:    userTokenInfo.Name,
		Balance: userTokenInfo.Balance,
		History: dealObjList,
	}

	// Create the payload
	payload := contr_return.GetUserTokenInfo{
		TxID:          stub.GetTxID(),
		UserTokenInfo: userTokenInfoObj,
	}
	return sendTheResult(payload)
}
