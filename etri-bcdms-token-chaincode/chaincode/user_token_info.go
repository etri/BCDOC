/*
 * Copyright ETRI. All Rights Reserved.
 */

package chaincode

import (
	"bitbucket.org/bigpicturelabs/etri-bcdms-msg-protocol-go/object"
)

type UserTokenInfo struct {
	ID      string
	Name    string
	Balance int32
	History []*Deal
}

func newUserTokenInfo(userID string, userName string) *UserTokenInfo {
	return &UserTokenInfo{
		ID:      userID,
		Name:    userName,
		Balance: 0,
		History: []*Deal{},
	}
}

type Deal struct {
	ID       string
	Amount   int32
	Date     int64
	TxID     string
	DealType object.Deal_DealType
	RefID    string
}
