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

func TestEvaluationInterface_InvokeCreateEvaluation(t *testing.T) {
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

	argFirst := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: newEvaluation01,
	}

	newEvaluation02 := &object.Evaluation{
		Id:                "new-evaluation-test02",
		Score:             5,
		Comment:           "Test comment 02",
		Date:              1234567890,
		DocumentID:        newDocument.Id,
		DocumentHashValue: newDocument.VersionList[0].HashValue,
	}

	argSecond := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: newEvaluation02,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeCreateOrUpdateDocument(argToCreateDocument, stub)

	// Run
	resFirst := invokeCreateOrUpdateEvaluation(argFirst, stub)
	resSecond := invokeCreateOrUpdateEvaluation(argSecond, stub)

	// Assertion
	if resFirst.Status != shim.OK {
		t.Error(errors.New(resFirst.Message))
		t.FailNow()
	}

	if resSecond.Status != shim.OK {
		t.Error(errors.New(resSecond.Message))
		t.FailNow()
	}

	var savedDoc Document
	err := json.Unmarshal(stub.State[newDocument.Id], &savedDoc)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	var savedEval Evaluation
	err = json.Unmarshal(stub.State[newEvaluation01.Id], &savedEval)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	assert.Equal(t, 2, len(savedDoc.VersionList[0].EvaluationInfoList))
	assert.Equal(t, newEvaluation02.Id, savedDoc.VersionList[0].EvaluationInfoList[0].ID)
	assert.Equal(t, int32(4), savedDoc.VersionList[0].Score)
	assert.Equal(t, newEvaluation01.DocumentID, savedEval.DocumentID)
}

func TestEvaluationInterface_InvokeUpdateEvaluation(t *testing.T) {
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

	argToCreateEvalFirst := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: newEvaluation01,
	}

	newEvaluation02 := &object.Evaluation{
		Id:                "new-evaluation-test02",
		Score:             5,
		Comment:           "Test comment 02",
		Date:              1234567890,
		DocumentID:        newDocument.Id,
		DocumentHashValue: newDocument.VersionList[0].HashValue,
	}

	argToCreateEvalSecond := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: newEvaluation02,
	}

	updateEvaluation01 := &object.Evaluation{
		Id:                "new-evaluation-test01",
		Score:             1,
		Comment:           "Test comment 01 updated",
		Date:              1234567890,
		DocumentID:        newDocument.Id,
		DocumentHashValue: newDocument.VersionList[0].HashValue,
	}

	arg := &contr_args.CreateOrUpdateEvaluation{
		NewEvaluation: updateEvaluation01,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeCreateOrUpdateDocument(argToCreateDocument, stub)
	invokeCreateOrUpdateEvaluation(argToCreateEvalFirst, stub)
	invokeCreateOrUpdateEvaluation(argToCreateEvalSecond, stub)

	// Run
	res := invokeCreateOrUpdateEvaluation(arg, stub)

	// Assertion
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	var savedDoc Document
	err := json.Unmarshal(stub.State[newDocument.Id], &savedDoc)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	var savedEval Evaluation
	err = json.Unmarshal(stub.State[newEvaluation01.Id], &savedEval)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	assert.Equal(t, 2, len(savedDoc.VersionList[0].EvaluationInfoList))
	assert.Equal(t, updateEvaluation01.Id, savedDoc.VersionList[0].EvaluationInfoList[1].ID)
	assert.Equal(t, int32(3), savedDoc.VersionList[0].Score)
	assert.Equal(t, updateEvaluation01.Comment, savedEval.Comment)
}

func invokeCreateOrUpdateEvaluation(arg *contr_args.CreateOrUpdateEvaluation, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncCreateOrUpdateEvaluation), argBytes})
}
