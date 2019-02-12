import * as React from 'react'
import ScoreEvaluationBar from '../ScoreEvaluationBar/ScoreEvaluationBar'
import { Document, RootState } from '../../types/index'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface State {
  score: number
  comment: string
}

export interface Props {
  evaluate: (
    id: string,
    documentID: string,
    comment: string,
    score: number,
    documentHashValue: string,
    resetState: () => void
  ) => void
  document: Document
  id: string
  isLoading: boolean
  errorMsg: string
}

class EvaluationModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      score: 0,
      comment: ''
    }

    this.onChangeScore = this.onChangeScore.bind(this)
    this.evaluate = this.evaluate.bind(this)
    this.resetState = this.resetState.bind(this)
  }

  private resetState() {
    this.setState({ score: 0, comment: '' })
  }

  private evaluate() {
    const { id, hashValue } = this.props.document
    const comment = this.state.comment
    const userid = this.props.id
    const score = this.state.score

    console.log('userid', userid)
    console.log('comment', comment)
    console.log('docid', id)
    console.log('hashValue', hashValue)
    console.log('score', score)

    this.props.evaluate(userid, id, comment, score, hashValue, this.resetState)
  }

  private onCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ comment: e.currentTarget.value })
  }

  private onChangeScore(score: number) {
    this.setState({ score: score })
  }

  render() {
    return (
      <React.Fragment>
        <div className="modal" id="EvaluateModal">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <ScoreEvaluationBar onChangeScore={this.onChangeScore} maxScore={5} />
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {this.props.errorMsg ? (
                  <div className="alert alert-danger" role="alert">
                    Error: {this.props.errorMsg}
                  </div>
                ) : (
                  ''
                )}
                <div className="form-group">
                  <textarea
                    className="form-control rounded-0"
                    id="exampleFormControlTextarea2"
                    value={this.state.comment}
                    onChange={e => this.onCommentChange(e)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  id="loginClose"
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  style={{ width: '80px' }}
                  type="button"
                  className="btn btn-primary"
                  onClick={this.evaluate}
                  disabled={this.props.isLoading ? true : false}
                >
                  {this.props.isLoading ? (
                    <FontAwesomeIcon icon="spinner" className="fa-spin" size="xs" />
                  ) : (
                    'Evaluate'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ UserStoreState, DocumentsStoreState }: RootState) {
  return {
    id: UserStoreState.User.userID,
    isLoading: DocumentsStoreState.EvaluateIsLoading,
    errorMsg: DocumentsStoreState.ErrorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    evaluate: (
      id: string,
      documentID: string,
      comment: string,
      score: number,
      documentHashValue: string,
      resetState: () => void
    ) => {
      dispatch(actions.evaluate(id, documentID, comment, score, documentHashValue, resetState))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationModal)
