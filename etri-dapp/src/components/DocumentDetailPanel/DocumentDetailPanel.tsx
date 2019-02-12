import * as React from 'react'
import { connect } from 'react-redux'
import { Document } from '../../types/index'
import InfoPanel from './InfoPanel'
import EvaluationPanel from './EvaluationPanel'
import CommentPanel from './CommentPanel'
import EvaluationModal from '../EvaluationModal/EvaluationModal'
import './DocumentDetailPanel.css'

export interface Props {
  document: Document
}

export interface State {
  versionedDocument: Document
  index: number
}

class DocumentDetailPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      versionedDocument: props.document,
      index: 0
    }

    this._changeVersion = this._changeVersion.bind(this)
  }

  render() {
    // const { document } = this.props
    const document = this.state.versionedDocument

    if (!document) return <p>No document</p>
    if (!document.id) return <p>No document</p>

    return (
      <React.Fragment>
        {document ? (
          <div
            style={{
              border: '1px',
              borderColor: '#a5a5a5',
              borderStyle: 'solid',
              borderRadius: '20px'
            }}
          >
            <div style={{ padding: '20px' }}>
              <div className="header">
                <h4>
                  <b>{document.title}</b>
                </h4>
              </div>
              <InfoPanel
                document={document}
                changeVersion={this._changeVersion}
                index={this.state.index}
              />
              <EvaluationPanel
                rating={document.score}
                evaluationList={document.evaluationList}
                index={this.state.index}
              />
              <CommentPanel evaluations={document.evaluationList} />
              <EvaluationModal document={document} />
            </div>
          </div>
        ) : (
          <div />
        )}
      </React.Fragment>
    )
  }

  private _changeVersion(version: any, index: number) {
    const versionedDocument: Document = {
      id: this.props.document.id,
      type: this.props.document.type,
      title: version.title,
      issueDate: version.envelope.issueDate,
      authorList: JSON.stringify(version.authorList),
      projectID: version.projectID,
      fileName: version.envelope.fileName,
      version: version.envelope.version,
      hashValue: version.hashValue,
      evaluationList: version.evaluationList,
      score: version.score,
      versionList: this.props.document.versionList
    }

    this.setState({ versionedDocument, index })
  }
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
)(DocumentDetailPanel)
