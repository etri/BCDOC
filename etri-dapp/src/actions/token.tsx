import { tokenApi } from '../api/index'
import { UserTokenInfo } from '../types/index'
import { CommonActionType } from './common'

export enum TokenActionType {
  QUERY_TOKEN_SUCCESS = 'QUERY_TOKEN_SUCCESS',
  QUERY_TOKEN_FAIL = 'QUERY_TOKEN_FAIL',
  TRANSFER_TOKEN_SUCCESS = 'TRANSFER_TOKEN_SUCCESS',
  TRANSFER_TOKEN_FAIL = 'TRANSFER_TOKEN_FAIL'
}

export interface TokenAction {
  type: TokenActionType
  token: UserTokenInfo
  errorMsg: string
}

export function queryToken(startIndex: number, lastIndex: number) {
  return async (dispatch: any) => {
    console.log('start to query token')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      const tokenInfo: UserTokenInfo = await tokenApi.queryToken(startIndex, lastIndex)
      console.log(tokenInfo)
      dispatch({
        type: TokenActionType.QUERY_TOKEN_SUCCESS,
        token: tokenInfo
      })
    } catch (error) {
      dispatch({
        type: TokenActionType.QUERY_TOKEN_FAIL
      })
      console.log('fail to query token')
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })

    console.log('end to query token')
  }
}

export function transfer(
  sourceUserID: string,
  targetUserID: string,
  amount: number,
  timestamp: number
) {
  return async (dispatch: any) => {
    console.log('start to transfer token')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      await tokenApi.transfer(sourceUserID, targetUserID, amount, timestamp)
      dispatch({
        type: TokenActionType.TRANSFER_TOKEN_SUCCESS
      })
    } catch (error) {
      dispatch({
        type: TokenActionType.TRANSFER_TOKEN_FAIL,
        errorMsg: error.toString()
      })
      console.log('fail to transfer token')
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })

    console.log('end to transfer token')
  }
}
