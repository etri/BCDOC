import * as React from 'react'
import { connect } from 'react-redux'
import './InfoPanel.css'
import StarRating from '../StarRating/StarRating'
import { Document, RootState } from '../../types/index'
import { toyyyymmdd, parseAuthor, toyyyy, getFirstAuthorID } from '../../common'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { documentApi } from '../../api/index'
import { Link } from 'react-router-dom'

export interface Props {
  document: Document
  loggedIn: boolean
  id: string
  index: number
  changeVersion: (version: any, index: number) => void
}

export interface State {
  // versionedDocument: Document
  // index: number
}

class InfoPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // this.state = {
    //   versionedDocument: props.document,
    //   index: 0
    // }

    // this._changeVersion = this._changeVersion.bind(this)
  }

  render() {
    const { document, loggedIn, id } = this.props

    let dropdownMenu: any[] = []

    if (document.versionList) {
      document.versionList.forEach((version: any, index: number) =>
        dropdownMenu.push(
          <a
            className="dropdown-item"
            href="#"
            key={version.envelope.version}
            onClick={() => this.props.changeVersion(version, index)}
          >
            {`${version.envelope.version}(${toyyyy(new Date(version.envelope.issueDate))})`}
          </a>
        )
      )
    }

    return (
      <React.Fragment>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
              <dl className="row">
                <dt className="col-md-3">저자</dt>
                <dd className="col-md-9">{parseAuthor(document.authorList)}</dd>
                <dt className="col-md-3">발행일</dt>
                <dd className="col-md-9">{toyyyymmdd(new Date(document.issueDate))}</dd>
                <dt className="col-md-3">협약과제</dt>
                <dd className="col-md-9">{document.projectID}</dd>
              </dl>
            </div>
            <div className="col-md-5">
              <ul className="list-inline col-md-12 padding-5 align-middle">
                {this.props.index === 0 ? (
                  <li className="list-inline-item">
                    <a
                      className="fa-clickable"
                      onClick={e => download(document.type, document.id, document.fileName)}
                    >
                      <FontAwesomeIcon icon="download" size="5x" />
                    </a>
                  </li>
                ) : (
                  ''
                )}
                <li className="list-inline-item">
                  <span>
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <b>{document.version + ` (${toyyyy(new Date(document.issueDate))})`}</b>
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {dropdownMenu}
                      </div>
                    </div>
                  </span>
                  <br />
                  <StarRating number={document.score} />
                </li>
                <li className="list-inline-item">
                  {loggedIn && id === getFirstAuthorID(document.authorList) ? (
                    <Link to={`/main/documents/${document.id}/update`}>
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginBottom: '20px' }}
                      >
                        업데이트
                      </button>
                    </Link>
                  ) : (
                    ''
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  // private _changeVersion(version: any, index: number) {
  //   const versionedDocument: Document = {
  //     id: this.props.document.id,
  //     type: this.props.document.type,
  //     title: version.title,
  //     issueDate: version.envelope.issueDate,
  //     authorList: JSON.stringify(version.authorList),
  //     projectID: version.projectID,
  //     fileName: version.envelope.fileName,
  //     version: version.envelope.version,
  //     hashValue: version.hashValue,
  //     evaluationList: version.evaluationList,
  //     score: version.score,
  //     versionList: this.props.document.versionList
  //   }

  //   this.setState({ versionedDocument, index })
  // }
}

async function download(docType: string, docID: string, name: string) {
  await documentApi.download(docType, docID, name)
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
)(InfoPanel)
