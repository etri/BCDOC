/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"errors"
	"strconv"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Only connector-related error messages; returned as a message parameter of shim.Error
const (
	ErrIncorrectArguments      = "incorrect chaincode arguments"
	ErrFailedToFinishFunc      = "failed to finish a function"
	ErrFailedToReadState       = "failed to read data from the blockchain"
	ErrFailedToWriteBlockchain = "failed to write data to the blockchain"
)

// Detail errors
var (
	ErrIncorrectNumberOfArguments = errors.New("only one argument needed")
	ErrInvalidFuncName            = errors.New("invalid function name")
	ErrInvalidAmountForMint       = errors.New("invalid amount for mint")
	ErrNilUserIDOrName            = errors.New("nil user ID or name")
	ErrAlreadyExistingUser        = errors.New("already existing user")
	ErrEmptyValueOfArguments      = errors.New("nil or empty value of the arguments")
	ErrInvalidArguments           = errors.New("invalid arguments")
	ErrInsufficientToken          = errors.New("insufficient token")
	ErrNoSuchItem                 = errors.New("no such item")
)

var (
	FuncMint                = contr_args.TokenFuncName_MINT.String()
	FuncGiveReward          = contr_args.TokenFuncName_GIVE_REWARD.String()
	FuncTransfer            = contr_args.TokenFuncName_TRANSFER.String()
	FuncGetUserTokenInfo    = contr_args.TokenFuncName_GET_USER_TOKEN_INFO.String()
	FuncCreateUserTokenInfo = contr_args.TokenFuncName_CREATE_USER_TOKEN_INFO.String()
	FuncUpdateRewardValue   = contr_args.TokenFuncName_UPDATE_REWARD_VALUE.String()
)

type TokenInterface struct {
}

const (
	initialRewardValueForCreatingDoc  = "30"
	initialRewardValueForCreatingEval = "5"
	initialRewardValueForScore        = "10"
)

var initialRewardValueList = []string{initialRewardValueForCreatingDoc, initialRewardValueForCreatingEval, initialRewardValueForScore}

func (t *TokenInterface) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fnc, _ := stub.GetFunctionAndParameters()

	switch fnc {
	case "init":
		cbTokenInfo := newUserTokenInfo(centralBankKey, centralBankName)

		cbTokenInfoBytes, err := json.Marshal(cbTokenInfo)
		if err != nil {
			return sendError(ErrFailedToWriteBlockchain, err)
		}

		err = stub.PutState(centralBankKey, cbTokenInfoBytes)
		if err != nil {
			return sendError(ErrFailedToWriteBlockchain, err)
		}

		// DealType 0, 1, 2에 대해서만 reward value setting
		for i := 0; i < 3; i++ {
			key, err := stub.CreateCompositeKey(rewardValueKeyPrefix, []string{strconv.Itoa(i)})
			if err != nil {
				return sendError(ErrFailedToWriteBlockchain, err)
			}

			err = stub.PutState(key, []byte(initialRewardValueList[i]))
			if err != nil {
				return sendError(ErrFailedToWriteBlockchain, err)
			}
		}

		return shim.Success(nil)
	default:
		return shim.Success(nil)
	}

}

func (t *TokenInterface) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	txID := stub.GetTxID()
	fnc, args := stub.GetFunctionAndParameters()

	if len(args) != 1 {
		initResp := sendError(ErrIncorrectArguments, ErrIncorrectNumberOfArguments)
		logExit(fnc, initResp)
		return initResp
	}

	logEnter(fnc, args[0], txID)

	var resp pb.Response
	switch fnc {
	case FuncMint:
		resp = t.mint(stub, args)
	case FuncGiveReward:
		resp = t.giveReward(stub, args)
	case FuncCreateUserTokenInfo:
		resp = t.createUserTokenInfo(stub, args)
	case FuncGetUserTokenInfo:
		resp = t.getUserTokenInfo(stub, args)
	case FuncTransfer:
		resp = t.transfer(stub, args)
	case FuncUpdateRewardValue:
		resp = t.updateRewardValue(stub, args)
	default:
		resp = sendError(ErrIncorrectArguments, ErrInvalidFuncName)
	}

	logExit(fnc, resp)

	return resp
}
