/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"bytes"
	"crypto/sha256"
	"encoding/base64"
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

type hashSHA256 struct {
}

func newHashSHA256() *hashSHA256 {
	return &hashSHA256{}
}

func (s *hashSHA256) digest(target []byte) []byte {
	sum := sha256.Sum256(target)

	return sum[:]
}

func (s *hashSHA256) compare(target []byte, digest []byte) bool {
	digestedTarget := s.digest(target)

	return bytes.Equal(digestedTarget, digest)
}

func checkHash(target interface{}, hashValue string) (bool, error) {
	targetBytes, err := json.Marshal(target)
	if err != nil {
		return false, err
	}

	hash := newHashSHA256()
	hashBytes := hash.digest(targetBytes)
	encoded := base64.StdEncoding.EncodeToString(hashBytes)

	return encoded == hashValue, nil
}

func calculateDocumentVersionScore(evaluationInfoList []*EvaluationInfo) int32 {
	var newScore int32
	for _, eachEvaluationInfo := range evaluationInfoList {
		newScore += eachEvaluationInfo.Score
	}
	newScore = newScore / int32(len(evaluationInfoList))

	return newScore
}
