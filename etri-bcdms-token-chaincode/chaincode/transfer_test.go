/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"errors"
	"testing"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/stretchr/testify/assert"
)

func TestTokenInterface_InvokeTransfer(t *testing.T) {
	// Data
	argForMint := &contr_args.Mint{
		Amount: 3000,
	}

	argForCreateSourceUser := &contr_args.CreateUserTokenInfo{
		UserID:   "source-user-id01",
		UserName: "test-user-name01",
	}

	argForCreateTargetUser := &contr_args.CreateUserTokenInfo{
		UserID:   "target-user-id01",
		UserName: "test-user-name01",
	}

	argForSourceRewardList := getArgForReward(5, argForCreateSourceUser.UserID)
	argForTargetRewardList := getArgForReward(5, argForCreateTargetUser.UserID)

	arg := &contr_args.Transfer{
		SourceUserID: argForCreateSourceUser.UserID,
		TargetUserID: argForCreateTargetUser.UserID,
		Amount:       50,
		Timestamp:    123456789,
	}

	// Preconditions
	scc := new(TokenInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeMint(argForMint, stub)
	invokeCreateUserTokenInfo(argForCreateSourceUser, stub)
	invokeCreateUserTokenInfo(argForCreateTargetUser, stub)
	for _, argForReward := range argForSourceRewardList {
		invokeGiveReward(argForReward, stub)
	}
	for _, argForReward := range argForTargetRewardList {
		invokeGiveReward(argForReward, stub)
	}

	// Run
	res := invokeTransfer(arg, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	// Assertions
	var savedSourceUser UserTokenInfo
	json.Unmarshal(stub.State[argForCreateSourceUser.UserID], &savedSourceUser)

	var savedTargetUser UserTokenInfo
	json.Unmarshal(stub.State[argForCreateTargetUser.UserID], &savedTargetUser)

	assert.Equal(t, int32(100), savedSourceUser.Balance)
	assert.Equal(t, 6, len(savedSourceUser.History))
	assert.Equal(t, object.Deal_TRANSFER, savedSourceUser.History[0].DealType)
	assert.Equal(t, int32(200), savedTargetUser.Balance)
	assert.Equal(t, 6, len(savedTargetUser.History))
	assert.Equal(t, object.Deal_TRANSFER, savedTargetUser.History[0].DealType)
}

func invokeTransfer(arg *contr_args.Transfer, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncTransfer), argBytes})
}
