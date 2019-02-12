import * as React from 'react'
import { connect } from 'react-redux'
import { Evaluation } from '../../types/index'
import StarRating from '../StarRating/StarRating'
import './CommentItem.css'

export interface Props {
  evaluation: Evaluation
}

function CommentItem({ evaluation }: Props) {
  return (
    <React.Fragment>
      <li className="list-group-item comment">
        <ul className="list-unstyled">
          <li>
            <span className="badge badge-dark right-margin-5">{evaluation.id}</span>
            <StarRating number={evaluation.score} />
          </li>
          <li>{evaluation.comment}</li>
        </ul>
      </li>
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
)(CommentItem)
