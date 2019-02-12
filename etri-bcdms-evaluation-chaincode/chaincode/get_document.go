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

func (e *EvaluationInterface) getDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.GetDocument
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Get the document
	var document Document
	err = readState(arg.DocumentID, &document, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Create the payload
	documentObj, err := convertDocumentToProtoObject(&document, stub)
	if err != nil {
		return sendError(ErrFailedToFinishFunc, err)
	}

	payload := contr_return.GetDocument{
		TxID:     stub.GetTxID(),
		Document: documentObj,
	}
	return sendTheResult(payload)
}

func convertDocumentToProtoObject(document *Document, stub shim.ChaincodeStubInterface) (*object.Document, error) {
	var versionList []*object.VersionedDocument
	for _, versionedDocument := range document.VersionList {
		var authorList []*object.Author
		for _, author := range versionedDocument.AuthorList {
			authorObj := &object.Author{Id: author.ID, Name: author.Name}
			authorList = append(authorList, authorObj)
		}

		var evaluationList []*object.Evaluation
		for _, evaluationInfo := range versionedDocument.EvaluationInfoList {
			var evaluation Evaluation
			err := readState(evaluationInfo.ID, &evaluation, stub)
			if err != nil {
				return nil, err
			}

			evaluationObj := convertEvaluationToProtoObject(&evaluation)
			evaluationList = append(evaluationList, evaluationObj)
		}

		versionedDocumentObj := &object.VersionedDocument{
			Title:      versionedDocument.Title,
			AuthorList: authorList,
			ProjectID:  versionedDocument.ProjectID,
			Envelope: &object.DocumentEnvelope{
				FileName:  versionedDocument.Envelope.FileName,
				Version:   versionedDocument.Envelope.Version,
				IssueDate: versionedDocument.Envelope.IssueDate,
			},
			HashValue:      versionedDocument.HashValue,
			EvaluationList: evaluationList,
			Score:          versionedDocument.Score,
		}

		versionList = append(versionList, versionedDocumentObj)
	}

	return &object.Document{
		Id:          document.ID,
		Type:        document.Type,
		VersionList: versionList,
	}, nil
}
