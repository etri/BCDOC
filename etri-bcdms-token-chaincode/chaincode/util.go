/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

func sendError(msg string, err error) pb.Response {
	if err != nil {
		return shim.Error(fmt.Sprintf("%s - Error: %s", msg, err.Error()))

	} else {
		return shim.Error(fmt.Sprintf("%s - Error: nil", msg))
	}
}

func sendTheResult(payload interface{}) pb.Response {
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return sendError(ErrFailedToFinishFunc, err)
	}

	return shim.Success(payloadBytes)
}

func log(fnc string, message string) {
	current := time.Now().UnixNano() / int64(time.Millisecond)
	printed := fmt.Sprintf("%d - [%s]: %s", current, fnc, message)

	fmt.Println(printed)
}

func logEnter(fnc string, arg string, txID string) {
	message := fmt.Sprintf("arg - %s, txID - %s", arg, txID)

	log(fnc+"-Enter", message)
}

func logExit(fnc string, resp pb.Response) {
	if resp.Status == shim.OK {
		log(fnc+"-Exit", string(resp.GetPayload()[:]))
	} else {
		log(fnc+"-Exit", resp.GetMessage())
	}
}

func logReadState(key string, value []byte) {
	message := fmt.Sprintf("key - %s, value - %s", key, string(value[:]))

	log("ReadState", message)
}

func logWriteState(key string, value []byte) {
	message := fmt.Sprintf("key - %s, value - %s", key, string(value[:]))

	log("WriteState", message)
}
