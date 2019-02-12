/*
 * Copyright ETRI. All Rights Reserved.
 */
 
package chaincode

import (
	"encoding/json"
	"errors"
	"testing"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/stretchr/testify/assert"
)

func TestTokenInterface_InvokeCreateUserTokenInfo(t *testing.T) {
	// Data
	arg := &contr_args.CreateUserTokenInfo{
		UserID:   "test-user-id01",
		UserName: "test-user-name01",
	}

	// Preconditions
	scc := new(TokenInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})

	// Run
	res := invokeCreateUserTokenInfo(arg, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	// Assertions
	var saved UserTokenInfo
	json.Unmarshal(stub.State[arg.UserID], &saved)

	assert.Equal(t, arg.UserName, saved.Name)
}

func invokeCreateUserTokenInfo(arg *contr_args.CreateUserTokenInfo, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncCreateUserTokenInfo), argBytes})
}
