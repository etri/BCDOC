import * as React from 'react'
import { connect } from 'react-redux'
import { Document } from '../../types/index'
import './DocumentItem.css'
import StarRating from '../StarRating/StarRating'
import { Link } from 'react-router-dom'
import { getFirstAuthorName, toyyyymmdd } from '../../common/index'
import * as actions from '../../actions'

export interface Props {
  document: Document
  select: (document: Document) => void
}

function DocumentItem({ document, select }: Props) {
  return (
    <React.Fragment>
      <li className="list-group-item">
        <ul className="list-unstyled">
          <li>
            <span className="badge badge-warning right-margin-5">
              {toyyyymmdd(new Date(document.issueDate))}
            </span>
            <span className="badge badge-success right-margin-5">
              {getFirstAuthorName(document.authorList)}
            </span>
            <StarRating number={document.score} />
          </li>
          <li>
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link
                  style={style.black}
                  to={'/main/documents/' + document.id}
                  onClick={e => select(document)}
                >
                  {document.title}
                </Link>
              </li>
              <li className="list-inline-item right">
                <span className="badge badge-secondary text-right">{document.version}</span>
              </li>
            </ul>
          </li>
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
  return {
    select: (document: Document) => dispatch(actions.selectDoc(document))
  }
}

const style = {
  black: {
    color: '#000000'
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentItem)
