/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/base64"
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

func TestEvaluationInterface_InvokeCreateDocument(t *testing.T) {
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

	arg := &contr_args.CreateOrUpdateDocument{
		NewDocument: newDocument,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})

	// Run
	res := invokeCreateOrUpdateDocument(arg, stub)

	// Assertion
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	var result contr_return.CreateOrUpdateDocument
	err := json.Unmarshal(res.Payload, &result)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	assert.True(t, result.Success)

	var saved Document
	err = json.Unmarshal(stub.State[newDocument.Id], &saved)
	if err != nil {
		t.Error(err)
		t.FailNow()
	}

	assert.Equal(t, newDocument.VersionList[0].HashValue, saved.VersionList[0].HashValue)

	typeID, _ := stub.CreateCompositeKey(DocTypePrefix, []string{DocTypeTechnicalDoc})
	var savedType DocumentType
	json.Unmarshal(stub.State[typeID], &savedType)
	assert.Equal(t, 1, len(savedType.DocumentIDList))
	assert.Equal(t, newDocument.Id, savedType.DocumentIDList[0])
}

func TestEvaluationInterface_InvokeUpdateDocument(t *testing.T) {
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

	argToCreate := &contr_args.CreateOrUpdateDocument{
		NewDocument: newDocument,
	}

	updateMeta := &object.Document{
		Id:   "new-document-id01",
		Type: DocTypeTechnicalDoc,
		VersionList: []*object.VersionedDocument{
			{
				Title: "new-document-title-updated01",
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

	updateMeta.VersionList[0].HashValue = getHashValue(updateMeta.VersionList[0].Envelope)

	argToUpdateMeta := &contr_args.CreateOrUpdateDocument{
		NewDocument: updateMeta,
	}

	addVersion := &object.Document{
		Id:   "new-document-id01",
		Type: DocTypeTechnicalDoc,
		VersionList: []*object.VersionedDocument{
			{
				Title: "new-document-title-updated01",
				AuthorList: []*object.Author{
					{Id: "author-id-01", Name: "author-name-01"},
					{Id: "author-id-02", Name: "author-name-02"},
				},
				ProjectID: "new-document-project01",
				Envelope: &object.DocumentEnvelope{
					FileName:  "new-document-filename-updated01",
					Version:   "new-document-version-updated01",
					IssueDate: 1234567890,
				},
				HashValue:      "",
				EvaluationList: []*object.Evaluation{},
				Score:          0,
			},
		},
	}

	addVersion.VersionList[0].HashValue = getHashValue(addVersion.VersionList[0].Envelope)

	argToAddVersion := &contr_args.CreateOrUpdateDocument{
		NewDocument: addVersion,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	invokeCreateOrUpdateDocument(argToCreate, stub)

	// Run
	res := invokeCreateOrUpdateDocument(argToUpdateMeta, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	res = invokeCreateOrUpdateDocument(argToAddVersion, stub)
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	// Assertion
	var saved Document
	json.Unmarshal(stub.State[newDocument.Id], &saved)

	assert.Equal(t, 2, len(saved.VersionList))
	assert.Equal(t, updateMeta.VersionList[0].Title, saved.VersionList[1].Title)
	assert.Equal(t, addVersion.VersionList[0].Envelope.FileName, saved.VersionList[0].Envelope.FileName)
}

func invokeCreateOrUpdateDocument(arg *contr_args.CreateOrUpdateDocument, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncCreateOrUpdateDocument), argBytes})
}

func getHashValue(targetObj interface{}) string {
	target, _ := json.Marshal(targetObj)

	hash := newHashSHA256()
	hashBytes := hash.digest(target)

	return base64.StdEncoding.EncodeToString(hashBytes)
}
