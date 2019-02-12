import * as React from 'react'
import { connect } from 'react-redux'
import { Document } from '../../types/index'
import DocumentItem from './DocumentItem'
import './DocumentList.css'

export interface Props {
  documents: Document[]
}

function DocumentList({ documents }: Props) {
  if (!documents) return null
  if (!documents.length) return <p>No documents</p>

  return (
    <React.Fragment>
      <ul className="list-group">
        {documents.map(function(document, idx) {
          return <DocumentItem key={idx} document={document} />
        })}
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
)(DocumentList)
