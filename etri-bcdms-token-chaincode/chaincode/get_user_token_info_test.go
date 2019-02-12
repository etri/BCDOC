/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"errors"
	"fmt"
	"testing"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/stretchr/testify/assert"
)

func TestTokenInterface_InvokeGetUserTokenInfo(t *testing.T) {
	// Data
	argForMint := &contr_args.Mint{
		Amount: 3000,
	}

	argForCreateUserTokenInfo := &contr_args.CreateUserTokenInfo{
		UserID:   "test-user-id01",
		UserName: "test-user-name01",
	}

	argForRewardList := getArgForReward(20, argForCreateUserTokenInfo.UserID)

	arg := &contr_args.GetUserTokenInfo{
		UserID:   argForCreateUserTokenInfo.UserID,
		StartIdx: 15,
		EndIdx:   20,
	}

	// Preconditions
	scc := new(TokenInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeMint(argForMint, stub)
	invokeCreateUserTokenInfo(argForCreateUserTokenInfo, stub)
	for _, argForReward := range argForRewardList {
		invokeGiveReward(argForReward, stub)
	}

	// Run
	res := invokeGetUserTokenInfo(arg, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	// Assertion
	var result contr_return.GetUserTokenInfo
	json.Unmarshal(res.Payload, &result)

	assert.Equal(t, 5, len(result.UserTokenInfo.History))
	assert.Equal(t, "test-deal-id04", result.UserTokenInfo.History[0].Id)

}

func invokeGetUserTokenInfo(arg *contr_args.GetUserTokenInfo, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncGetUserTokenInfo), argBytes})
}

func getArgForReward(count int, userID string) []*contr_args.GiveReward {
	var argList []*contr_args.GiveReward
	for i := 0; i < count; i++ {
		var id string
		if i < 10 {
			id = fmt.Sprintf("test-deal-id0%d", i)
		} else {
			id = fmt.Sprintf("test-deal-id%d", i)
		}

		arg := &contr_args.GiveReward{
			UserID: userID,
			Deal: &object.Deal{
				Id:       id,
				Amount:   30,
				Date:     123456789,
				TxID:     "test-txid-01",
				DealType: object.Deal_CREATE_DOC,
				RefID:    "test-refid-01",
			},
		}

		argList = append(argList, arg)
	}

	return argList
}
