import * as React from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import SearchPanel from './SearchPanel/SearchPanel'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { RootState, Document, DocumentType, UserTokenInfo /*, History*/ } from '../types/index'
import DocumentDetailPanel from './DocumentDetailPanel/DocumentDetailPanel'
import CreateDocumentPanel from './CreateDocumentPanel/CreateDocumentPanel'
import WalletPanel from './WalletPanel/WalletPanel'
import LoginFormModal from './LoginFormModal/LoginFormModal'
import { RouteComponentProps } from 'react-router'
import PageLoader from './PageLoader/PageLoader'
import { getDocuments } from 'src/actions/document'
import { initUser } from 'src/actions/user'
import * as $ from 'jquery'
import AdminNavbar from './AdminNavbar/AdminNavbar'
import HistoryList from './HistoryList/HistoryList'
import TransactionSearchPanel from './TransactionSearchPanel/TransactionSearchPanel'
import BlockSearchPanel from './BlockSearchPanel/BlockSearchPanel'
import RegisterFormModal from './RegisterFormModal/RegisterFormModal'
import UpdateDocumentPanel from './UpdateDocumentPanel/UpdateDocumentPanel'
import { getTransactionList, queryToken } from '../actions'

interface PathParamsType {
  id: string
}

export interface Props extends RouteComponentProps<PathParamsType> {
  Documents: Document[]
  dispatch: any
  isLoading: boolean
  loggedIn: boolean
  userTokenInfo: UserTokenInfo
  selectedDocument: Document
}

export interface State {
  walletIndex: number
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      walletIndex: 0
    }

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  //initially load data from api
  initializeDocuments = () => {
    this.props.dispatch(getDocuments(DocumentType.DocTypeTechnicalDoc, 0, 10))
  }

  initializeUserInfo = async () => {
    this.props.dispatch(initUser())
  }

  initializeTransactionList = async () => {
    this.props.dispatch(getTransactionList(0, 10))
  }

  hideLoginForm = () => {
    if (this.props.loggedIn) {
      $('.close').click()
    }
  }

  componentDidUpdate() {
    this.hideLoginForm()
  }

  componentDidMount() {
    this.initializeUserInfo()
    this.initializeDocuments()
    this.initializeTransactionList()
  }

  public render() {
    return (
      <div className="App ">
        {<LoginFormModal />}
        <RegisterFormModal />
        <React.Fragment>
          <Route
            path="/main"
            render={({}) => (
              <React.Fragment>
                <Navbar />
                <div className="col-md-10 offset-md-1" style={{ paddingTop: '20px' }}>
                  {this.props.isLoading ? (
                    <PageLoader />
                  ) : (
                    <React.Fragment>
                      <Route
                        exact
                        path="/main"
                        render={({}) => <SearchPanel documents={this.props.Documents} />}
                      />
                      <Route
                        exact
                        path="/main/documents/:id"
                        render={({ match }) => (
                          <DocumentDetailPanel document={this.props.selectedDocument} />
                        )}
                      />
                      <Route
                        exact
                        path="/main/documents/:id/update"
                        render={({ match }) => (
                          <UpdateDocumentPanel document={this.props.selectedDocument} />
                        )}
                      />
                      <Route path="/main/createDocument" component={CreateDocumentPanel} />
                      <Route
                        path="/main/wallet"
                        render={({}) => (
                          <WalletPanel
                            tokenInfo={this.props.userTokenInfo}
                            index={this.state.walletIndex}
                            next={this.next}
                            previous={this.previous}
                          />
                        )}
                      />
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
          />
          <Route
            path="/admin"
            render={({}) => (
              <React.Fragment>
                <AdminNavbar />
                <Route
                  path="/admin/history"
                  render={({}) => (
                    <React.Fragment>
                      <HistoryList />
                    </React.Fragment>
                  )}
                />
                <Route
                  path="/admin/blockSearch"
                  render={({}) => (
                    <React.Fragment>
                      <BlockSearchPanel />
                    </React.Fragment>
                  )}
                />
                <Route
                  path="/admin/transactionSearch"
                  render={({}) => (
                    <React.Fragment>
                      <TransactionSearchPanel />
                    </React.Fragment>
                  )}
                />
              </React.Fragment>
            )}
          />
        </React.Fragment>
      </div>
    )
  }

  private next() {
    const startIndex = this.state.walletIndex + 10
    const lastIndex = startIndex + 10

    this.props.dispatch(queryToken(startIndex, lastIndex))
    this.setState({ walletIndex: startIndex })
  }

  private previous() {
    const startIndex = this.state.walletIndex - 10
    const lastIndex = startIndex + 10

    this.props.dispatch(queryToken(startIndex, lastIndex))
    this.setState({ walletIndex: startIndex })
  }
}

// Wiring up with stores and actions
function mapStateToProps({
  DocumentsStoreState,
  CommonStoreState,
  UserStoreState,
  TokenStoreState,
  TransactionStoreState
}: RootState) {
  return {
    Documents: DocumentsStoreState.Documents,
    isLoading: CommonStoreState.isLoading,
    loggedIn: UserStoreState.User.loggedIn,
    userTokenInfo: TokenStoreState.token,
    selectedDocument: DocumentsStoreState.SelectedDoc,
    historys: TransactionStoreState.transactionList
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch: dispatch
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
)
