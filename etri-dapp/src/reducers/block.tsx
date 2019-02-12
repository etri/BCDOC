import { Block, BlockStoreState } from '../types/index'
import { BlockAction, BlockActionType } from '../actions/block'

const INITIAL_STATE: BlockStoreState = {
  block: {} as Block,
  errorMsg: ''
}

export default (state: BlockStoreState = INITIAL_STATE, action: BlockAction): BlockStoreState => {
  switch (action.type) {
    case BlockActionType.REQUEST_BLOCK_BY_HEIGHT:
      return { ...state, block: {} as Block, errorMsg: '' }

    case BlockActionType.REQUEST_BLOCK_BY_HEIGHT_SUCCESS:
      return { ...state, block: action.block, errorMsg: '' }

    case BlockActionType.REQUEST_BLOCK_BY_HEIGHT_FAIL:
      console.log(action.errorMsg)
      return { ...state, block: {} as Block, errorMsg: action.errorMsg }

    case BlockActionType.REQUEST_LAST_BLOCK:
      return { ...state, block: {} as Block, errorMsg: '' }

    case BlockActionType.REQUEST_LAST_BLOCK_SUCCESS:
      return { ...state, block: action.block, errorMsg: '' }

    case BlockActionType.REQUEST_LAST_BLOCK_FAIL:
      console.log(action.errorMsg)
      return { ...state, block: {} as Block, errorMsg: action.errorMsg }

    default:
      return state
  }
}
