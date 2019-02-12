/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"

	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_args"
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/contr_return"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

var (
	centralBankName = "Central_Bank_Key"
	centralBankKey  = createCBKey()
)

func (t *TokenInterface) mint(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// Unmarshal the argument
	var arg contr_args.Mint
	err := json.Unmarshal([]byte(args[0]), &arg)
	if err != nil {
		return sendError(ErrIncorrectArguments, err)
	}

	// Check the input validity
	if arg.Amount <= 0 {
		return sendError(ErrIncorrectArguments, ErrInvalidAmountForMint)
	}

	// Get the central bank
	var cbTokenInfo UserTokenInfo
	err = readState(centralBankKey, &cbTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToReadState, err)
	}

	// Update the central bank
	cbTokenInfo.Balance += arg.Amount

	// Save to the blockchain
	err = writeState(centralBankKey, cbTokenInfo, stub)
	if err != nil {
		return sendError(ErrFailedToWriteBlockchain, err)
	}

	// Create the payload
	payload := contr_return.Mint{
		TxID:    stub.GetTxID(),
		Success: true,
	}
	return sendTheResult(payload)
}

func createCBKey() string {
	// Hash SHA256
	sum := sha256.Sum256([]byte(centralBankName))
	// base64 encoding
	encoded := base64.StdEncoding.EncodeToString(sum[:])

	return encoded
}
