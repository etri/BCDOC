import { Transaction, TransactionStoreState, History } from '../types/index'
import { TransactionAction, TransactionActionType } from '../actions/transaction'

const INITIAL_STATE: TransactionStoreState = {
  transaction: {} as Transaction,
  transactionList: [] as History[],
  errorMsg: ''
}

export default (
  state: TransactionStoreState = INITIAL_STATE,
  action: TransactionAction
): TransactionStoreState => {
  switch (action.type) {
    case TransactionActionType.REQUEST_TRANSACTION_BY_ID:
      return { ...state, transaction: {} as Transaction, errorMsg: '' }

    case TransactionActionType.REQUEST_TRANSACTION_BY_ID_SUCCESS:
      return { ...state, transaction: action.transaction, errorMsg: '' }

    case TransactionActionType.REQUEST_TRANSACTION_BY_ID_FAIL:
      return { ...state, transaction: {} as Transaction, errorMsg: action.errorMsg }

    case TransactionActionType.REQUEST_TRANSACTIONLIST:
      return { ...state, transactionList: [] as History[], errorMsg: '' }

    case TransactionActionType.REQUEST_TRANSACTIONLIST_SUCCESS:
      return { ...state, transactionList: action.transactionList, errorMsg: '' }

    case TransactionActionType.REQUEST_TRANSACTIONLIST_FAIL:
      return { ...state, transactionList: {} as History[], errorMsg: action.errorMsg }

    default:
      return state
  }
}
