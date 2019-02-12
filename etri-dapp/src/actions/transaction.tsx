import { Transaction, History } from '../types/index'
import { blockApi } from '../api/index'

export enum TransactionActionType {
  REQUEST_TRANSACTION_BY_ID = 'REQUEST_TRANSACTION_BY_ID',
  REQUEST_TRANSACTION_BY_ID_SUCCESS = 'REQUEST_TRANSACTION_BY_ID_SUCCESS',
  REQUEST_TRANSACTION_BY_ID_FAIL = 'REQUEST_TRANSACTION_BY_ID_FAIL',
  REQUEST_TRANSACTIONLIST = 'REQUEST_TRANSACTIONLIST',
  REQUEST_TRANSACTIONLIST_SUCCESS = 'REQUEST_TRANSACTIONLIST_SUCCESS',
  REQUEST_TRANSACTIONLIST_FAIL = 'REQUEST_TRANSACTIONLIST_FAIL'
}

export interface TransactionAction {
  type: TransactionActionType
  transaction?: Transaction
  transactionList?: History[]
  errorMsg: string
}

export function getTransactionByID(txID: string, channel: string) {
  return async (dispatch: any) => {
    dispatch({
      type: TransactionActionType.REQUEST_TRANSACTION_BY_ID
    })

    try {
      const transaction: Transaction = await blockApi.getTransactionByID(txID, channel)
      dispatch({
        type: TransactionActionType.REQUEST_TRANSACTION_BY_ID_SUCCESS,
        transaction: transaction
      })
    } catch (error) {
      dispatch({
        type: TransactionActionType.REQUEST_TRANSACTION_BY_ID_FAIL,
        errorMsg: error.toString()
      })
    }
  }
}

export function getTransactionList(startIdx: number, endIdx: number) {
  return async (dispatch: any) => {
    dispatch({
      type: TransactionActionType.REQUEST_TRANSACTIONLIST
    })

    try {
      const transactionList: History[] = await blockApi.getTransactionList(startIdx, endIdx)
      console.log(transactionList)
      dispatch({
        type: TransactionActionType.REQUEST_TRANSACTIONLIST_SUCCESS,
        transactionList: transactionList
      })
    } catch (error) {
      dispatch({
        type: TransactionActionType.REQUEST_TRANSACTIONLIST_FAIL,
        errorMsg: error.toString()
      })
    }
  }
}
