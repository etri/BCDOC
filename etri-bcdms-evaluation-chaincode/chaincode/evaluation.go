/*
 * Copyright ETRI. All Rights Reserved.
 */


package chaincode

import (
	"encoding/json"
	"errors"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	DocTypePrefix       = "doctype"
	DocTypeTechnicalDoc = "technical-document"
	DocTypeJournal      = "paper-document"
	DocTypePatent       = "patent-document"
	DocTypeReport       = "report-document"
	DocTypeBook         = "book-document"
	DocTypeStandard     = "standard-document"
)

// Only connector-related error messages; returned as a message parameter of shim.Error
const (
	ErrIncorrectArguments      = "incorrect chaincode arguments"
	ErrFailedToFinishFunc      = "failed to finish a function"
	ErrFailedToReadState       = "failed to read data from the blockchain"
	ErrFailedToWriteBlockchain = "failed to write data to the blockchain"
)

// Detail errors
var (
	ErrIncorrectNumberOfArguments       = errors.New("only one argument needed")
	ErrInvalidFuncName                  = errors.New("invalid function name")
	ErrNilID                            = errors.New("nil ID value")
	ErrIncorrectInitialVersionList      = errors.New("incorrect number of version list")
	ErrFailedToValidateHashValue        = errors.New("failed to validate hash value against the envelope")
	ErrIncorrectArgumentValue           = errors.New("wrong argument value")
	ErrDuplicatedVersion                = errors.New("duplicated version value")
	ErrNoSuchDocumentType               = errors.New("no such document type")
	ErrNoSuchDocument                   = errors.New("no such document")
	ErrNoSuchDocumentVersion            = errors.New("no such document version")
	ErrInvalidUpdateEvaluationArguments = errors.New("not same document ID or hash value for updating evaluation")
	NoSuchEvaluation                    = errors.New("no such evaluation")
	ErrNoSuchItem                       = errors.New("no such item")
)

var (
	FuncGetDocumentList          = contr_args.FuncName_GET_DOCUMENT_LIST.String()
	FuncGetDocument              = contr_args.FuncName_GET_DOCUMENT.String()
	FuncCreateOrUpdateDocument   = contr_args.FuncName_CREATE_OR_UPDATE_DOCUMENT.String()
	FuncGetEvaluation            = contr_args.FuncName_GET_EVALUATION.String()
	FuncCreateOrUpdateEvaluation = contr_args.FuncName_CREATE_OR_UPDATE_EVALUATION.String()
)

type EvaluationInterface struct {
}

func (e *EvaluationInterface) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fnc, _ := stub.GetFunctionAndParameters()

	switch fnc {
	case "init":
		docTypeList := []string{DocTypeTechnicalDoc, DocTypeJournal, DocTypePatent, DocTypeReport, DocTypeBook, DocTypeStandard}

		for _, docType := range docTypeList {
			id, err := stub.CreateCompositeKey(DocTypePrefix, []string{docType})
			if err != nil {
				return sendError(ErrFailedToWriteBlockchain, err)
			}

			documentType := &DocumentType{
				ID:             id,
				DocumentType:   docType,
				DocumentIDList: []string{},
			}

			documentTypeBytes, err := json.Marshal(documentType)
			if err != nil {
				return sendError(ErrFailedToWriteBlockchain, err)
			}

			err = stub.PutState(id, documentTypeBytes)
			if err != nil {
				return sendError(ErrFailedToWriteBlockchain, err)
			}
		}

		return shim.Success(nil)
	default:
		return shim.Success(nil)
	}
}

func (e *EvaluationInterface) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	txID := stub.GetTxID()
	fnc, args := stub.GetFunctionAndParameters()

	if len(args) != 1 {
		initResp := sendError(ErrIncorrectArguments, ErrIncorrectNumberOfArguments)
		logExit(fnc, initResp)
		return initResp
	}

	logEnter(fnc, args[0], txID)

	var resp pb.Response
	switch fnc {
	case FuncGetDocumentList:
		resp = e.getDocumentList(stub, args)
	case FuncGetDocument:
		resp = e.getDocument(stub, args)
	case FuncCreateOrUpdateDocument:
		resp = e.createOrUpdateDocument(stub, args)
	case FuncGetEvaluation:
		resp = e.getEvaluation(stub, args)
	case FuncCreateOrUpdateEvaluation:
		resp = e.createOrUpdateEvaluation(stub, args)
	default:
		resp = sendError(ErrIncorrectArguments, ErrInvalidFuncName)
	}

	logExit(fnc, resp)

	return resp
}
