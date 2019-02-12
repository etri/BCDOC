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

func TestEvaluationInterface_InvokeGetDocumentList(t *testing.T) {
	// Data
	newDocumentList := getNewDocumentList(20)
	// 2, 3, 4
	startIdx := int32(2)
	endIdx := int32(5)

	arg := &contr_args.GetDocumentList{
		DocumentType: DocTypeJournal,
		StartIdx:     startIdx,
		EndIdx:       endIdx,
	}

	// Precondition
	scc := new(EvaluationInterface)
	stub := shim.NewMockStub("evaluation", scc)
	stub.MockInit("1", [][]byte{[]byte("init"), nil})
	for _, newDocument := range newDocumentList {
		argToCreate := &contr_args.CreateOrUpdateDocument{
			NewDocument: newDocument,
		}
		invokeCreateOrUpdateDocument(argToCreate, stub)
	}

	// Run
	res := invokeGetDocumentList(arg, stub)

	// Assertion
	if res.Status != shim.OK {
		t.Error(errors.New(res.Message))
		t.FailNow()
	}

	var result contr_return.GetDocumentList
	json.Unmarshal(res.Payload, &result)

	assert.Equal(t, 3, len(result.DocumentList))
	assert.Equal(t, "new-document-id15", result.DocumentList[0].Id)
	assert.Equal(t, "new-document-id13", result.DocumentList[1].Id)
}

func invokeGetDocumentList(arg *contr_args.GetDocumentList, stub *shim.MockStub) pb.Response {
	argBytes, _ := json.Marshal(arg)

	return stub.MockInvoke("1", [][]byte{[]byte(FuncGetDocumentList), argBytes})
}

func getNewDocumentList(count int) []*object.Document {
	var documentList []*object.Document
	for i := 0; i < count; i++ {
		var documentType string
		if i%2 == 0 {
			documentType = DocTypeTechnicalDoc
		} else {
			documentType = DocTypeJournal
		}

		var id string
		if i < 10 {
			id = fmt.Sprintf("new-document-id0%d", i)
		} else {
			id = fmt.Sprintf("new-document-id%d", i)
		}

		newDocument := &object.Document{
			Id:   id,
			Type: documentType,
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

		documentList = append(documentList, newDocument)
	}

	return documentList
}
