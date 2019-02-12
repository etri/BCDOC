/*
 * Copyright ETRI. All Rights Reserved.
 */


package chaincode

import (
	"encoding/json"
	"errors"
	"testing"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/stretchr/testify/assert"
)

func TestEvaluationInterface_InvokeGetEvaluation(t *testing.T) {
	// Data
	newDocument := &object.Document{
		Id:   "new-document-id01",
		Type: DocTypeTechnicalDoc,
		VersionList: []*object.VersionedDocument{
			{
				Title: "new-document-title01",
				AuthorList: []*object.Author{
					{Id: "author-id-01", Name: "author-name-01"},
					{Id: "author-id-02", Name: "author-name-02"},
				},
				ProjectID: "new-document-project01",
				Envelope: &object.DocumentEnvelope{
					FileName:  "new-document-filename01",
					Version:   "new-document-version01",
					IssueDate: 1234567890,
				},
				HashValue:      "",
				EvaluationList: []*object.Evaluation{},
				Score:          0,
			},
		},
	}

	newDocument.VersionList[0].HashValue = getHashValue(newDocument.VersionList[0].Envelope)

	argToCreateDocument := &contr_args.CreateOrUpdateDocument{
		NewDocument: newDocument,
	}

	newEvaluation01 := &object.Evaluation{
		Id:                "new-evaluation-test01",
		Score:             3,
		Comment:           "Test comment 01",
		Date:              1234567890,
		DocumentID:        newDocument.Id,
		DocumentHashValue: newDocument.VersionList[0].HashValue,
	}

	argToCreateEval := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: newEvaluation01,
	}

	arg := &contr_args.GetEvaluation{
		EvaluationID: newEvaluation01.Id,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeCreateOrUpdateDocument(argToCreateDocument, stub)
	invokeCreateOrUpdateEvaluation(argToCreateEval, stub)

	// Run
	res := invokeGetEvaluation(arg, stub)

	// Assertion
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	var result contr_return.GetEvaluation
	err := json.Unmarshal(res.Payload, &result)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	assert.Equal(t, newEvaluation01.DocumentHashValue, result.Evaluation.DocumentHashValue)
}

func invokeGetEvaluation(arg *contr_args.GetEvaluation, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncGetEvaluation), argBytes})
}
