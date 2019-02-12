import * as React from 'react'
import Button from '../Button/Button'
import LabelInputBar from '../LabelInputBar/LabelInputBar'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { DocumentType, Author } from '../../types/index'
import FileSelector from '../FileSelector/FileSelector'
import { RootState } from 'src/types'
import AuthorSearchBar from './AuthorSearchBar'
import { Redirect } from 'react-router-dom'

const documentTypes: { [key: string]: DocumentType } = {
  'technical-document': DocumentType.DocTypeTechnicalDoc,
  'standard-document': DocumentType.DocTypeStandard,
  'report-document': DocumentType.DocTypeReport,
  'patent-document': DocumentType.DocTypePatent,
  'journal-document': DocumentType.DocTypeJournal,
  'book-document': DocumentType.DocTypeBook
}

const documentTypesLabel: { [key: string]: string } = {
  [DocumentType.DocTypeTechnicalDoc]: '기술문서',
  [DocumentType.DocTypeStandard]: '국제표준',
  [DocumentType.DocTypeReport]: '연구보고서',
  [DocumentType.DocTypePatent]: '특허',
  [DocumentType.DocTypeJournal]: '논문',
  [DocumentType.DocTypeBook]: '단행본'
}

export interface Props {
  createDoucment(
    title: string,
    authorList: Author[],
    projectID: string,
    version: string,
    docType: DocumentType,
    documentFile: File
  ): void
  userID: string
  userName: string
  errorMsg: string
}

export interface State {
  title: string
  author: string
  version: string
  projectID: string
  additionalAuthor: Author[]
  documentType: DocumentType
  documentFile: File
  cancelled: boolean
  errorMsg: string
}

class CreateTechnicalDocumentPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      title: '',
      author: '',
      version: '',
      projectID: '',
      documentFile: {} as File,
      additionalAuthor: [],
      documentType: DocumentType.DocTypeTechnicalDoc,
      cancelled: false,
      errorMsg: ''
    }

    this.onAdditionalAuthorChange = this.onAdditionalAuthorChange.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onVersionChange = this.onVersionChange.bind(this)
    this.onDocumentTypeChange = this.onDocumentTypeChange.bind(this)
    this.onProjectIDChange = this.onProjectIDChange.bind(this)
    this.createDocument = this.createDocument.bind(this)
    this.onDocumentFileChange = this.onDocumentFileChange.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  render() {
    if (this.state.cancelled) {
      return <Redirect to="/main" />
    }
    return (
      <React.Fragment>
        <div style={style.container}>
          <div style={style.jumbotron}>
            <b>새로운 기술문서 생성</b>
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
            <LabelInputBar label="제목" onChangeFunc={this.onTitleChange} />
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
                <span style={{ fontSize: 18 }}>{this.props.userID}</span>
              </div>
            </div>
            <AuthorSearchBar initialList={[]} onAuthorChange={this.onAdditionalAuthorChange} />
            <LabelInputBar label="프로젝트" onChangeFunc={this.onProjectIDChange} />
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
            <div className="row" style={{ margin: '20px' }}>
              <div
                className="col-md-3"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 18 }}>
                  <b>타입</b>
                </span>
              </div>
              <div className="col-md-9">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                  >
                    {documentTypesLabel[this.state.documentType]}
                  </button>
                  <div className="dropdown-menu">
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypeTechnicalDoc)}
                    >
                      {documentTypesLabel[DocumentType.DocTypeTechnicalDoc]}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypeStandard)}
                    >
                      {documentTypesLabel[DocumentType.DocTypeStandard]}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypeReport)}
                    >
                      {documentTypesLabel[DocumentType.DocTypeReport]}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypePatent)}
                    >
                      {documentTypesLabel[DocumentType.DocTypePatent]}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypeJournal)}
                    >
                      {documentTypesLabel[DocumentType.DocTypeJournal]}
                    </a>
                    <a
                      className="dropdown-item"
                      onClick={() => this.onDocumentTypeChange(DocumentType.DocTypeBook)}
                    >
                      {documentTypesLabel[DocumentType.DocTypeBook]}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <LabelInputBar label="버전" onChangeFunc={this.onVersionChange} />
          </div>
        </div>
        <div className="offset-md-3 col-md-6">
          <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={this.cancel} text="취소" color="#393939" />
            <Button onClick={this.createDocument} text="생성" color="#3A8EED" />
          </div>
        </div>
      </React.Fragment>
    )
  }

  private createDocument() {
    console.log(this.state.title)
    console.log(this.state.author)
    console.log(this.state.documentType)
    console.log(this.state.version)

    if (
      !this.state.title ||
      !this.state.projectID ||
      !this.state.version ||
      !this.state.documentFile
    ) {
      return this.setState({ errorMsg: '모든 필드를 채우세요' })
    }

    const title = this.state.title
    const authorList: Author[] = [
      {
        name: this.props.userName,
        id: this.props.userID
      },
      ...this.state.additionalAuthor
    ]

    const projectID = this.state.projectID
    const version = this.state.version
    const documentType: DocumentType = this.state.documentType

    this.props.createDoucment(
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

  private onDocumentTypeChange(documentType: string) {
    this.setState({ documentType: documentTypes[documentType] })
  }

  private onProjectIDChange(projectID: string) {
    this.setState({ projectID: projectID })
  }

  private onTitleChange(title: string) {
    this.setState({ title: title })
  }

  private onAdditionalAuthorChange(authorList: Author[]) {
    this.setState({ additionalAuthor: authorList })
  }

  private onVersionChange(version: string) {
    this.setState({ version: version })
  }

  private cancel() {
    this.setState({ cancelled: true })
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
    createDoucment: (
      title: string,
      authorList: Author[],
      projectID: string,
      version: string,
      docType: DocumentType,
      documentFile: File
    ) =>
      dispatch(actions.createDocument(title, authorList, projectID, version, docType, documentFile))
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
)(CreateTechnicalDocumentPanel)
