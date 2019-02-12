import { evaluationApi } from '../api/index'
import * as $ from 'jquery'
import { Evaluation } from '../types/index'

export enum EvaluationActionType {
  EVALUATE_FAIL = 'EVALUATE_FAIL',
  EVALUATE_SUCCESS = 'EVALUATE_SUCCESS',
  EVALUATE_REQUEST = 'EVALUATE_REQUEST'
}

export interface EvaluationAction {
  type: EvaluationActionType
  evaluateErrorMsg: string
}

export function evaluate(
  id: string,
  documentID: string,
  comment: string,
  score: number,
  documentHashValue: string
) {
  return async (dispatch: any) => {
    dispatch({
      type: EvaluationActionType.EVALUATE_REQUEST
    })

    try {
      const evaluation: Evaluation = await evaluationApi.evaluate(
        id,
        score,
        comment,
        new Date().getDate(),
        documentID,
        documentHashValue
      )
      console.log('created evaluation: ', evaluation)

      dispatch({
        type: EvaluationActionType.EVALUATE_SUCCESS
      })
    } catch (error) {
      console.log(error)
      dispatch({
        type: EvaluationActionType.EVALUATE_FAIL,
        evaluateErrorMsg: error.toString()
      })
    }

    $('.close').click()
  }
}
