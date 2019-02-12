import { Block } from '../types/index'
import { blockApi } from '../api/index'

export enum BlockActionType {
  REQUEST_BLOCK_BY_HEIGHT = 'REQUEST_BLOCK_BY_HEIGHT',
  REQUEST_BLOCK_BY_HEIGHT_SUCCESS = 'GET_BLOCK_BY_HEIGHT_SUCCESS',
  REQUEST_BLOCK_BY_HEIGHT_FAIL = 'REQUEST_BLOCK_BY_HEIGHT_FAIL',
  REQUEST_LAST_BLOCK = 'REQUEST_LAST_BLOCK',
  REQUEST_LAST_BLOCK_SUCCESS = 'REQUEST_LAST_BLOCK_SUCCESS',
  REQUEST_LAST_BLOCK_FAIL = 'REQUEST_LAST_BLOCK_FAIL'
}

export interface BlockAction {
  type: BlockActionType
  block: Block
  errorMsg: string
}

export function getBlockByHeight(height: number, channel: string) {
  return async (dispatch: any) => {
    dispatch({
      type: BlockActionType.REQUEST_BLOCK_BY_HEIGHT
    })

    try {
      const block: Block = await blockApi.getBlockByHeight(height, channel)
      console.log(block)
      dispatch({
        type: BlockActionType.REQUEST_BLOCK_BY_HEIGHT_SUCCESS,
        block: block
      })
    } catch (error) {
      dispatch({
        type: BlockActionType.REQUEST_BLOCK_BY_HEIGHT_FAIL,
        errorMsg: error.toString()
      })
    }
  }
}

export function getLastBlock(channel: string) {
  return async (dispatch: any) => {
    dispatch({
      type: BlockActionType.REQUEST_LAST_BLOCK
    })

    try {
      const block: Block = await blockApi.getLastBlock(channel)
      console.log(block)
      dispatch({
        type: BlockActionType.REQUEST_LAST_BLOCK_SUCCESS,
        block: block
      })
    } catch (error) {
      dispatch({
        type: BlockActionType.REQUEST_LAST_BLOCK_FAIL,
        errorMsg: error.toString()
      })
    }
  }
}
