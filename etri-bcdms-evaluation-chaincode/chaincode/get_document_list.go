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

func (e *EvaluationInterface) getDocumentList(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.GetDocumentList
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Basic validation check
	if arg.EndIdx < arg.StartIdx || arg.EndIdx < 0 || arg.StartIdx < 0 || arg.DocumentType == "" {
		return sendError(ErrIncorrectArguments, ErrIncorrectArgumentValue)
	}

	// Get document type
	documentTypeID, err := stub.CreateCompositeKey(DocTypePrefix, []string{arg.DocumentType})
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	var documentType DocumentType
	err = readState(documentTypeID, &documentType, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Read. Include startIdx, exclude endIdx
	var documentIDList []string
	documentListLength := int32(len(documentType.DocumentIDList))
	if arg.StartIdx < documentListLength {
		if arg.EndIdx > documentListLength {
			documentIDList = documentType.DocumentIDList[arg.StartIdx:]
		} else {
			documentIDList = documentType.DocumentIDList[arg.StartIdx:arg.EndIdx]
		}
	}

	var documentList []*object.Document
	for _, documentID := range documentIDList {
		var document Document
		err = readState(documentID, &document, stub)
		if err != nil {
			return sendError(ErrFailedToReadState, err)
		}

		documentObj, err := convertDocumentToProtoObject(&document, stub)
		if err != nil {
			return sendError(ErrFailedToReadState, err)
		}
		documentList = append(documentList, documentObj)
	}

	// Create the payload
	payload := contr_return.GetDocumentList{
		TxID:         stub.GetTxID(),
		DocumentList: documentList,
	}
	return sendTheResult(payload)
}
