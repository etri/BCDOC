import * as React from 'react'
import { connect } from 'react-redux'
import './EvaluationPanel.css'
import { RootState, Evaluation } from '../../types/index'

export interface Props {
  rating: number
  evaluationList: Evaluation[]
  loggedIn: boolean
  id: string
  index: number
}

export interface State {}

function EvaluationPanel({ rating, evaluationList = [], loggedIn, id, index }: Props) {
  return (
    <React.Fragment>
      <div className="border">
        <ul className="list-inline col-md-12 padding-5">
          <li className="list-inline-item">
            {loggedIn && index === 0 ? (
              checkDuplication(id, evaluationList) ? (
                <button
                  className="btn btn-primary btn-sm"
                  type="button"
                  data-toggle="modal"
                  data-target="#EvaluateModal"
                >
                  당신의 평가를 남겨주세요
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" type="button" disabled>
                  이미 평가하셨습니다.
                </button>
              )
            ) : (
              ''
            )}
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}

function checkDuplication(id: string, evaluationList: Evaluation[]): boolean {
  return evaluationList.every(evaluation => evaluation.evaluatorID !== id)
}

// Wiring up with stores and actions
function mapStateToProps({ UserStoreState }: RootState) {
  return {
    loggedIn: UserStoreState.User.loggedIn,
    id: UserStoreState.User.userID
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationPanel)
