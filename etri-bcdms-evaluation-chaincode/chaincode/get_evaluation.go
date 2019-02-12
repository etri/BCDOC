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

func (e *EvaluationInterface) getEvaluation(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.GetEvaluation
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Get the evaluation
	var evaluation Evaluation
	err = readState(arg.EvaluationID, &evaluation, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Create the payload
	payload := contr_return.GetEvaluation{
		TxID:       stub.GetTxID(),
		Evaluation: convertEvaluationToProtoObject(&evaluation),
	}
	return sendTheResult(payload)
}

func convertEvaluationToProtoObject(evaluation *Evaluation) *object.Evaluation {
	obj := &object.Evaluation{
		Id:                evaluation.ID,
		Score:             evaluation.Score,
		Comment:           evaluation.Comment,
		Date:              evaluation.Date,
		DocumentID:        evaluation.DocumentID,
		DocumentHashValue: evaluation.DocumentHashValue,
		EvaluatorID:       evaluation.EvaluatorID,
	}

	return obj
}
