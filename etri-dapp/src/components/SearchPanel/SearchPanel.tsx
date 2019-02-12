import * as React from 'react'
import DocumentList from '../DocumentList/DocumentList'
// import SearchBar from '../SearchBar/SearchBar'
import { Document, DocumentType, RootState, NavItemType } from '../../types/index'
import Pagination from '../Pagination/Pagination'
import { connect } from 'react-redux'
import * as actions from '../../actions'

export interface Props {
  documents: Document[]
  getDocuments(type: DocumentType, startIndex: number, endIndex: number): void
  currentNav: NavItemType
  index: number
  next(type: DocumentType, index: number): void
  previous(type: DocumentType, index: number): void
}

export interface State {}

class SearchPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  private getDocumentType(nav: NavItemType): DocumentType {
    switch (nav) {
      case 1:
        return DocumentType.DocTypeTechnicalDoc
      case 2:
        return DocumentType.DocTypeJournal
      case 3:
        return DocumentType.DocTypePatent
      case 4:
        return DocumentType.DocTypeReport
      case 5:
        return DocumentType.DocTypeBook
      case 6:
        return DocumentType.DocTypeStandard
    }
    return DocumentType.DocTypeTechnicalDoc
  }

  private next() {
    const docType = this.getDocumentType(this.props.currentNav)
    this.props.next(docType, this.props.index)
  }

  private previous() {
    const docType = this.getDocumentType(this.props.currentNav)
    this.props.previous(docType, this.props.index)
  }

  render() {
    return (
      <React.Fragment>
        {/* <SearchBar /> */}
        <DocumentList documents={this.props.documents} />
        <Pagination
          next={this.next}
          index={this.props.index}
          previous={this.previous}
          length={this.props.documents.length}
        />
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ NavItemStoreState }: RootState) {
  return {
    currentNav: NavItemStoreState.selectedNavItem,
    index: NavItemStoreState.index
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getDocuments: (type: DocumentType, startIndex: number, endIndex: number) =>
      dispatch(actions.getDocuments(type, startIndex, endIndex)),
    next: (type: DocumentType, index: number) => dispatch(actions.next(type, index)),
    previous: (type: DocumentType, index: number) => dispatch(actions.previous(type, index))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPanel)
