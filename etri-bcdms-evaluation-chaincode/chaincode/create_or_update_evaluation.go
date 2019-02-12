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

type Evaluation struct {
	ID                string
	Score             int32
	Comment           string
	Date              int64
	DocumentID        string
	DocumentHashValue string
	EvaluatorID       string
}

func (e *EvaluationInterface) createOrUpdateEvaluation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.CreateOrUpdateEvaluation
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	newEvaluation := arg.NewEvaluation

	// Check the input validity
	err = checkEvaluation(newEvaluation)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the document the evaluation references
	var document Document
	err = readState(newEvaluation.DocumentID, &document, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Check the hash value of the document
	ok := false
	var versionedDocument *VersionedDocument
	for _, version := range document.VersionList {
		if version.HashValue == newEvaluation.DocumentHashValue {
			ok = true
			versionedDocument = version
		}
	}

	if !ok {
		return sendError(ErrIncorrectArguments, ErrNoSuchDocumentVersion)
	}

	// Check if the evaluation exists
	var oldEvaluation Evaluation
	err = readState(newEvaluation.Id, &oldEvaluation, stub)
	if err != nil && err != ErrNoSuchItem {
		return sendError(ErrFailedToReadState, err)
	}

	if err == ErrNoSuchItem {
		// Create
		return createEvaluation(stub, newEvaluation, &document, versionedDocument)
	} else {
		// Update
		return updateEvaluation(stub, newEvaluation, &oldEvaluation, &document, versionedDocument)
	}
}

func createEvaluation(stub shim.ChaincodeStubInterface, newEvaluation *object.Evaluation, document *Document, version *VersionedDocument) pb.Response {
	// Create the object
	evaluation := &Evaluation{
		ID:                newEvaluation.Id,
		Score:             newEvaluation.Score,
		Comment:           newEvaluation.Comment,
		Date:              newEvaluation.Date,
		DocumentID:        newEvaluation.DocumentID,
		DocumentHashValue: newEvaluation.DocumentHashValue,
		EvaluatorID:       newEvaluation.EvaluatorID,
	}

	// Prepend to the document
	version.EvaluationInfoList = append([]*EvaluationInfo{{ID: evaluation.ID, Score: evaluation.Score}}, version.EvaluationInfoList...)

	// Calculate the document version score
	version.Score = calculateDocumentVersionScore(version.EvaluationInfoList)

	// Save to the blockchain
	err := writeState(evaluation.ID, evaluation, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	err = writeState(document.ID, document, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.CreateOrUpdateEvaluation{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func updateEvaluation(stub shim.ChaincodeStubInterface, newEvaluation *object.Evaluation, oldEvaluation *Evaluation, document *Document, version *VersionedDocument) pb.Response {
	if newEvaluation.DocumentID != oldEvaluation.DocumentID || newEvaluation.DocumentHashValue != oldEvaluation.DocumentHashValue {
		return sendError(ErrIncorrectArguments, ErrInvalidUpdateEvaluationArguments)
	}

	// Update the object
	oldEvaluation.Score = newEvaluation.Score
	oldEvaluation.Comment = newEvaluation.Comment
	oldEvaluation.Date = newEvaluation.Date

	// Modify the evaluation info
	for _, evaluationInfo := range version.EvaluationInfoList {
		if evaluationInfo.ID == oldEvaluation.ID {
			evaluationInfo.Score = oldEvaluation.Score
		}
	}

	// Calculate the document version score
	version.Score = calculateDocumentVersionScore(version.EvaluationInfoList)

	// Save to the blockchain
	err := writeState(oldEvaluation.ID, oldEvaluation, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	err = writeState(document.ID, document, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.CreateOrUpdateEvaluation{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func checkEvaluation(evaluation *object.Evaluation) error {
	if evaluation.Id == "" ||
		evaluation.Date <= 0 ||
		evaluation.DocumentID == "" ||
		evaluation.DocumentHashValue == "" ||
		evaluation.Score < 0 ||
		evaluation.Score > 5 {
		return ErrIncorrectArgumentValue
	}

	return nil
}
