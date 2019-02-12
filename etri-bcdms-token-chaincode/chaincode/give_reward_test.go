/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"errors"
	"strconv"
	"testing"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/stretchr/testify/assert"
)

func TestTokenInterface_InvokeGiveReward(t *testing.T) {
	// Data
	rewardValue, _ := strconv.Atoi(initialRewardValueForCreatingDoc)

	argForMint := &contr_args.Mint{
		Amount: 3000,
	}

	argForCreateUserTokenInfo := &contr_args.CreateUserTokenInfo{
		UserID:   "test-user-id01",
		UserName: "test-user-name01",
	}

	arg := &contr_args.GiveReward{
		UserID: argForCreateUserTokenInfo.UserID,
		Deal: &object.Deal{
			Id:       "test-deal-id01",
			Amount:   0,
			Date:     123456789,
			TxID:     "test-txid-01",
			DealType: object.Deal_CREATE_DOC,
			RefID:    "test-refid-01",
		},
	}

	// Preconditions
	scc := new(TokenInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeMint(argForMint, stub)
	invokeCreateUserTokenInfo(argForCreateUserTokenInfo, stub)

	// Run
	res := invokeGiveReward(arg, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	// Assertions
	var savedCB UserTokenInfo
	json.Unmarshal(stub.State[centralBankKey], &savedCB)

	var savedUser UserTokenInfo
	json.Unmarshal(stub.State[arg.UserID], &savedUser)

	assert.Equal(t, argForMint.Amount-int32(rewardValue), savedCB.Balance)
	assert.Equal(t, int32(rewardValue), savedUser.Balance)
}

func invokeGiveReward(arg *contr_args.GiveReward, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncGiveReward), argBytes})
}
