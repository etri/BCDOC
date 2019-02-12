import { CommonStoreState } from '../types'
import { CommonAction, CommonActionType } from '../actions/common'

const INITIAL_STATE: CommonStoreState = {
  isLoading: false
}

export default (
  state: CommonStoreState = INITIAL_STATE,
  action: CommonAction
): CommonStoreState => {
  switch (action.type) {
    case CommonActionType.START_LOADING:
      return { ...state, isLoading: true }
    case CommonActionType.END_LOADING:
      return { ...state, isLoading: false }
    default:
      return state
  }
}
