import { TokenStoreState, UserTokenInfo } from '../types/index'
import { TokenAction, TokenActionType } from '../actions/token'

const token = {
  id: ''
} as UserTokenInfo

const INITIAL_STATE: TokenStoreState = {
  token: token,
  errorMsg: ''
}

export default (state: TokenStoreState = INITIAL_STATE, action: TokenAction): TokenStoreState => {
  switch (action.type) {
    case TokenActionType.QUERY_TOKEN_SUCCESS:
      return { ...state, token: action.token, errorMsg: '' }
    case TokenActionType.TRANSFER_TOKEN_SUCCESS:
      return { ...state, errorMsg: '' }
    case TokenActionType.TRANSFER_TOKEN_FAIL:
      return { ...state, errorMsg: action.errorMsg }
    default:
      return state
  }
}
