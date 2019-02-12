import * as React from 'react'
import Button from '../Button/Button'
import LabelInputBar from '../LabelInputBar/LabelInputBar'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { Author, Document } from '../../types/index'
import FileSelector from '../FileSelector/FileSelector'
import { RootState } from 'src/types'
import AuthorSearchBar from '../CreateDocumentPanel/AuthorSearchBar'
import { Link } from 'react-router-dom'
import { parseAuthor } from '../../common/index'

export interface Props {
  updateDocument: (
    id: string,
    title: string,
    authorList: Author[],
    projectID: string,
    version: string,
    docType: string,
    documentFile: File
  ) => void
  document: Document
  userID: string
  userName: string
  errorMsg: string
}

export interface State {
  author: string
  version: string
  additionalAuthor: Author[]
  documentFile: File
  errorMsg: string
}

class UpdateDocumentPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      author: '',
      version: '',
      documentFile: {} as File,
      additionalAuthor: this.ParseAdditionalAuthorList(this.props.document.authorList),
      errorMsg: ''
    }

    this.onAdditionalAuthorChange = this.onAdditionalAuthorChange.bind(this)
    this.onVersionChange = this.onVersionChange.bind(this)
    this.onDocumentFileChange = this.onDocumentFileChange.bind(this)
    this.updateDocument = this.updateDocument.bind(this)
  }

  private ParseAdditionalAuthorList(authorListStr: string): Author[] {
    try {
      const authorList: Author[] = JSON.parse(authorListStr)
      console.log(authorList)
      if (authorList) {
        console.log('filter')
        console.log(authorList.filter(author => author.id != this.props.userID))
        return authorList.filter(author => author.id != this.props.userID)
      }
      return []
    } catch (error) {
      return []
    }
  }

  render() {
    return (
      <React.Fragment>
        <div style={style.container}>
          <div style={style.jumbotron}>
            <b>기존 기술문서 버전 업데이트</b>
          </div>
          <div className="offset-md-1 col-md-10">
            {this.state.errorMsg ? (
              <div className="alert alert-danger" role="alert">
                Error: {this.state.errorMsg}
              </div>
            ) : (
              ''
            )}
            {this.props.errorMsg ? (
              <div className="alert alert-danger" role="alert">
                Error: {this.props.errorMsg}
              </div>
            ) : (
              ''
            )}
            <div className="row" style={{ margin: '20px' }}>
              <div
                className="col-md-3"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>
                  <b>제목</b>
                </span>
              </div>
              <div
                className="col-md-9"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>{this.props.document.title}</span>
              </div>
            </div>
            <div className="row" style={{ margin: '20px' }}>
              <div
                className="col-md-3"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>
                  <b>저자</b>
                </span>
              </div>
              <div
                className="col-md-9"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>
                  {' '}
                  {parseAuthor(this.props.document.authorList)}{' '}
                </span>
              </div>
            </div>
            <AuthorSearchBar
              initialList={this.state.additionalAuthor}
              onAuthorChange={this.onAdditionalAuthorChange}
            />
            <div className="row" style={{ margin: '20px' }}>
              <div
                className="col-md-3"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>
                  <b>파일업로드</b>
                </span>
              </div>
              <div className="col-md-9">
                <FileSelector onFileChange={this.onDocumentFileChange} />
              </div>
            </div>
            <LabelInputBar label="버전" onChangeFunc={this.onVersionChange} />
          </div>
        </div>
        <div className="offset-md-3 col-md-6">
          <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button text="취소" color="#393939">
              <Link to="/main" />
            </Button>
            <Button onClick={this.updateDocument} text="업데이트" color="#F26077" />
          </div>
        </div>
      </React.Fragment>
    )
  }

  private updateDocument() {
    console.log(this.state.author)
    console.log(this.state.version)

    if (!this.state.version || !this.state.documentFile) {
      return this.setState({ errorMsg: '모든 필드를 채우세요' })
    }

    const title = this.props.document.title
    const authorList: Author[] = [
      {
        id: this.props.userID,
        name: this.props.userName
      } as Author,
      ...this.state.additionalAuthor
    ]

    const projectID = this.props.document.projectID
    const version = this.state.version
    const documentType: string = this.props.document.type

    this.props.updateDocument(
      this.props.document.id,
      title,
      authorList,
      projectID,
      version,
      documentType,
      this.state.documentFile
    )
  }

  private onDocumentFileChange(file: File) {
    this.setState({ documentFile: file })
  }

  private onAdditionalAuthorChange(authorList: Author[]) {
    this.setState({ additionalAuthor: authorList })
  }

  private onVersionChange(version: string) {
    this.setState({ version: version })
  }
}

function mapStateToProps({ UserStoreState, DocumentsStoreState }: RootState) {
  return {
    userID: UserStoreState.User.userID,
    userName: UserStoreState.User.userName,
    errorMsg: DocumentsStoreState.ErrorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateDocument: (
      id: string,
      title: string,
      authorList: Author[],
      projectID: string,
      version: string,
      docType: string,
      documentFile: File
    ) =>
      dispatch(
        actions.updateDocument(id, title, authorList, projectID, version, docType, documentFile)
      )
  }
}

const style = {
  container: {
    paddingTop: '10px',
    paddingLeft: '50px',
    paddingRight: '50px'
  },
  jumbotron: {
    height: '70px',
    backgroundColor: '#3C4E56',
    color: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '25px'
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateDocumentPanel)
