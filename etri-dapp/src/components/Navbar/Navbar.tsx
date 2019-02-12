import * as React from 'react'
import './Navbar.css'
import * as actions from '../../actions'
import { NavItemType, RootState, DocumentType } from '../../types/index'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export interface Props {
  selectedNavItem: NavItemType
  loggedIn: boolean
  id: string
  onSelectNav: (navItemType: NavItemType) => void
  fetchDocuments: (docType: DocumentType, startIndex: number, endIndex: number) => void
  queryToken: (startIndex: number, lastIndex: number) => void
  logout: () => void
}

const DefaultStartIndex = 0
const DefaultEndIndex = 10

function Navbar({
  selectedNavItem,
  onSelectNav,
  loggedIn,
  fetchDocuments,
  queryToken,
  id,
  logout
}: Props) {
  return (
    <nav className="navbar navbar-expand-xl navbar-dark bg-dark" data-toggle="affix">
      <div className="navbar-brand">ETRI BC문서관리시스템</div>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsingNavbar3"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="navbar-collapse collapse w-100" id="collapsingNavbar3">
        <ul className="navbar-nav w-100">
          <li className={'nav-item ' + IsActive(selectedNavItem, NavItemType.TechnicalDocument)}>
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.TechnicalDocument)
                fetchDocuments(DocumentType.DocTypeTechnicalDoc, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              기술문서
            </Link>
          </li>
          <li className={'nav-item ' + IsActive(selectedNavItem, NavItemType.Paper)}>
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.Paper)
                fetchDocuments(DocumentType.DocTypeJournal, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              논문
            </Link>
          </li>
          <li className={'nav-item ' + IsActive(selectedNavItem, NavItemType.Patent)}>
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.Patent)
                fetchDocuments(DocumentType.DocTypePatent, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              특허
            </Link>
          </li>
          <li className={'nav-item ' + IsActive(selectedNavItem, NavItemType.ResearchReport)}>
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.ResearchReport)
                fetchDocuments(DocumentType.DocTypeReport, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              연구보고서
            </Link>
          </li>
          <li className={'nav-item ' + IsActive(selectedNavItem, NavItemType.Book)}>
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.Book)
                fetchDocuments(DocumentType.DocTypeBook, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              단행본
            </Link>
          </li>
          <li
            className={'nav-item ' + IsActive(selectedNavItem, NavItemType.InternationalStandard)}
          >
            <Link
              className="nav-link"
              to={'/main'}
              onClick={() => {
                onSelectNav(NavItemType.InternationalStandard)
                fetchDocuments(DocumentType.DocTypeStandard, DefaultStartIndex, DefaultEndIndex)
              }}
            >
              국제표준
            </Link>
          </li>
        </ul>
        <ul className="nav navbar-nav ml-auto w-100 justify-content-end">
          <li className="nav-item">
            {loggedIn ? (
              <Link className="nav-link" to="/main/createDocument">
                <FontAwesomeIcon icon="pencil-alt" />
              </Link>
            ) : (
              <Link className="nav-link isDisabled" to="/main">
                <FontAwesomeIcon icon="pencil-alt" color="#dddddd" />
              </Link>
            )}
          </li>
          <li className="nav-item">
            {loggedIn ? (
              <Link className="nav-link" to="/main/wallet" onClick={e => queryToken(0, 10)}>
                <FontAwesomeIcon icon="wallet" />
              </Link>
            ) : (
              <Link className="nav-link isDisabled" to="/main">
                <FontAwesomeIcon icon="wallet" color="#dddddd" />
              </Link>
            )}
          </li>
          <li className="nav-item">
            {loggedIn ? (
              <a className="nav-link">{id}</a>
            ) : (
              <Link className="nav-link" to="#" data-toggle="modal" data-target="#LoginFormModal">
                로그인
              </Link>
            )}
          </li>
          {loggedIn && (
            <li className="nav-item">
              <Link className="nav-link" to="/main" onClick={logout}>
                로그아웃
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/admin/history">
              <FontAwesomeIcon icon="cog" />
            </Link>
          </li>
          {!loggedIn && (
            <li className="nav-item">
              <Link
                className="nav-link"
                to="#"
                data-toggle="modal"
                data-target="#RegisterFormModal"
              >
                <FontAwesomeIcon icon="user" />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

function IsActive(selectedNavItem: NavItemType, navItemType: NavItemType) {
  if (selectedNavItem == navItemType) {
    return 'active'
  }
  return ''
}

// Wiring up with stores and actions
function mapStateToProps({ NavItemStoreState, UserStoreState }: RootState) {
  return {
    selectedNavItem: NavItemStoreState.selectedNavItem,
    loggedIn: UserStoreState.User.loggedIn,
    id: UserStoreState.User.userID
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onSelectNav: (navItemType: NavItemType) => dispatch(actions.selectNavItem(navItemType)),
    fetchDocuments: (docType: DocumentType, startIndex: number, endIndex: number) =>
      dispatch(actions.getDocuments(docType, startIndex, endIndex)),
    queryToken: (startIndex: number, lastIndex: number) =>
      dispatch(actions.queryToken(startIndex, lastIndex)),
    logout: () => dispatch(actions.logout())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar)
