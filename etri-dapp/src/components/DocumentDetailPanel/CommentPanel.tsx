import * as React from 'react'
import { connect } from 'react-redux'
import { Evaluation } from '../../types/index'
import CommentList from '../CommentList/CommentList'

export interface Props {
  evaluations: Evaluation[]
}

export interface State {}

function CommentPanel({ evaluations }: Props) {
  return (
    <React.Fragment>
      <CommentList evaluations={evaluations}> </CommentList>
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
)(CommentPanel)
