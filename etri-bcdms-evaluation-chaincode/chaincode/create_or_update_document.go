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

type DocumentType struct {
	ID             string
	DocumentType   string
	DocumentIDList []string
}

type Document struct {
	ID          string
	Type        string
	VersionList []*VersionedDocument
}

type VersionedDocument struct {
	Title              string
	AuthorList         []*Author
	ProjectID          string
	Envelope           *DocumentEnvelope
	HashValue          string
	EvaluationInfoList []*EvaluationInfo
	Score              int32
}

type EvaluationInfo struct {
	ID    string
	Score int32
}

type Author struct {
	ID   string
	Name string
}

type DocumentEnvelope struct {
	FileName  string
	Version   string
	IssueDate int64
}

func (e *EvaluationInterface) createOrUpdateDocument(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.CreateOrUpdateDocument
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	newDocument := arg.NewDocument
	if newDocument.Id == "" {
		return sendError(ErrIncorrectArguments, ErrNilID)
	}

	// Check input validity
	if len(newDocument.VersionList) != 1 {
		return sendError(ErrIncorrectArguments, ErrIncorrectInitialVersionList)
	}

	err = checkVersionedDocument(newDocument.VersionList[0])
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Get the document type to check if the document type is valid
	documentTypeID, err := stub.CreateCompositeKey(DocTypePrefix, []string{newDocument.Type})
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	var documentType DocumentType
	err = readState(documentTypeID, &documentType, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Check if the document exists
	var existingDocument Document
	err = readState(newDocument.Id, &existingDocument, stub)
	if err != nil && err != ErrNoSuchItem {
		return sendError(ErrFailedToReadState, err)
	}

	if err == ErrNoSuchItem {
		// Create
		return createDocument(stub, newDocument, &documentType)
	} else {
		// Update
		return updateDocument(stub, newDocument, &existingDocument)
	}
}

func createDocument(stub shim.ChaincodeStubInterface, newDocument *object.Document, documentType *DocumentType) pb.Response {
	// Create the object
	newVersion := newDocument.VersionList[0]

	var authorList []*Author
	for _, authorObj := range newVersion.AuthorList {
		newAuthor := &Author{
			ID:   authorObj.Id,
			Name: authorObj.Name,
		}

		authorList = append(authorList, newAuthor)
	}

	document := &Document{
		ID:   newDocument.Id,
		Type: newDocument.Type,
		VersionList: []*VersionedDocument{
			{
				Title:      newVersion.Title,
				AuthorList: authorList,
				ProjectID:  newVersion.ProjectID,
				Envelope: &DocumentEnvelope{
					FileName:  newVersion.Envelope.FileName,
					IssueDate: newVersion.Envelope.IssueDate,
					Version:   newVersion.Envelope.Version,
				},
				HashValue:          newVersion.HashValue,
				EvaluationInfoList: []*EvaluationInfo{},
				Score:              0,
			},
		},
	}

	// Prepend to the document type
	documentType.DocumentIDList = append([]string{document.ID}, documentType.DocumentIDList...)

	// Save to the blockchain
	err := writeState(document.ID, document, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	err = writeState(documentType.ID, documentType, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.CreateOrUpdateDocument{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func updateDocument(stub shim.ChaincodeStubInterface, newDocument *object.Document, existingDocument *Document) pb.Response {
	newVersion := newDocument.VersionList[0]
	latestVersion := existingDocument.VersionList[0]

	if newVersion.Envelope.Version == latestVersion.Envelope.Version {
		// Meta info update
		// Envelope should not be changed when meta info update
		if newVersion.HashValue != latestVersion.HashValue {
			return sendError(ErrIncorrectArguments, ErrDuplicatedVersion)
		}

		latestVersion.ProjectID = newVersion.ProjectID
		latestVersion.Title = newVersion.Title
		var newAuthorList []*Author
		for _, author := range newVersion.AuthorList {
			newAuthor := &Author{ID: author.Id, Name: author.Name}
			newAuthorList = append(newAuthorList, newAuthor)
		}
		latestVersion.AuthorList = newAuthorList
	} else {
		// Create a new version
		var authorList []*Author
		for _, authorObj := range newVersion.AuthorList {
			newAuthor := &Author{
				ID:   authorObj.Id,
				Name: authorObj.Name,
			}

			authorList = append(authorList, newAuthor)
		}

		version := &VersionedDocument{
			Title:      newVersion.Title,
			AuthorList: authorList,
			ProjectID:  newVersion.ProjectID,
			Envelope: &DocumentEnvelope{
				FileName:  newVersion.Envelope.FileName,
				IssueDate: newVersion.Envelope.IssueDate,
				Version:   newVersion.Envelope.Version,
			},
			HashValue:          newVersion.HashValue,
			EvaluationInfoList: []*EvaluationInfo{},
			Score:              0,
		}

		// Prepend the new version
		existingDocument.VersionList = append([]*VersionedDocument{version}, existingDocument.VersionList...)
	}

	// Save to the blockchain
	err := writeState(existingDocument.ID, existingDocument, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.CreateOrUpdateDocument{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func checkVersionedDocument(version *object.VersionedDocument) error {
	// Basic argument check
	if version.Title == "" ||
		len(version.AuthorList) == 0 ||
		version.Envelope == nil ||
		version.Envelope.FileName == "" ||
		version.Envelope.IssueDate <= 0 ||
		version.Envelope.Version == "" ||
		version.HashValue == "" {
		return ErrIncorrectArgumentValue
	}

	// Check hashValue
	ok, err := checkHash(version.Envelope, version.HashValue)
	if err != nil {
		return err
	}
	if !ok {
		return ErrFailedToValidateHashValue
	}

	return nil
}
