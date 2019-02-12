import * as React from 'react'
import { connect } from 'react-redux'
import { Evaluation } from '../../types/index'
import CommentItem from './CommentItem'

export interface Props {
  evaluations: Evaluation[]
}

function CommentList({ evaluations }: Props) {
  return (
    <React.Fragment>
      <ul className="list-group">
        {evaluations ? (
          evaluations.map(function(evaluation, idx) {
            return <CommentItem key={idx} evaluation={evaluation} />
          })
        ) : (
          <div />
        )}
      </ul>
    </React.Fragment>
  )
}

// Wiring up with stores and actions
function mapStateToProps({}) {
  return {}
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentList)
