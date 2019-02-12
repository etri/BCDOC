import * as React from 'react'
import * as actions from '../../actions'
import { AdminNavItemType, RootState } from '../../types/index'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface Props {
  selectedAdminNavItem: AdminNavItemType
  onSelectNav: (adminNavItemType: AdminNavItemType) => void
  // fetchDocuments: (docType: DocumentType, startIndex: number, endIndex: number) => void
  // queryToken: (startIndex: number, lastIndex: number) => void
}

function AdminNavbar({ onSelectNav, selectedAdminNavItem }: Props) {
  return (
    <nav className="navbar navbar-expand-sm navbar-light bg-light" data-toggle="affix">
      <a href="/" className="navbar-brand d-flex w-50 mr-auto" />
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#collapsingNavbar3"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="navbar-collapse collapse w-100" id="collapsingNavbar3">
        <ul className="navbar-nav w-100 justify-content-center">
          <li className={'nav-item ' + IsActive(selectedAdminNavItem, AdminNavItemType.History)}>
            <Link
              className="nav-link"
              to={'/admin/history'}
              onClick={() => {
                onSelectNav(AdminNavItemType.History)
              }}
            >
              히스토리
            </Link>
          </li>
          <li
            className={'nav-item ' + IsActive(selectedAdminNavItem, AdminNavItemType.BlockSearch)}
          >
            <Link
              className="nav-link"
              to={'/admin/blockSearch'}
              onClick={() => {
                onSelectNav(AdminNavItemType.BlockSearch)
              }}
            >
              블록검색
            </Link>
          </li>
          <li
            className={
              'nav-item ' + IsActive(selectedAdminNavItem, AdminNavItemType.TransactionSearch)
            }
          >
            <Link
              className="nav-link"
              to={'/admin/transactionSearch'}
              onClick={() => {
                onSelectNav(AdminNavItemType.TransactionSearch)
              }}
            >
              Tx검색
            </Link>
          </li>
        </ul>
        <ul className="nav navbar-nav ml-auto w-100 justify-content-end">
          <li className="nav-item">
            <Link className="nav-link" to="/main">
              <FontAwesomeIcon icon="arrow-left" />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

function IsActive(selectedNavItem: AdminNavItemType, navItemType: AdminNavItemType) {
  if (selectedNavItem == navItemType) {
    return 'active'
  }
  return ''
}

// Wiring up with stores and actions
function mapStateToProps({ AdminNavItemStoreState }: RootState) {
  return {
    selectedAdminNavItem: AdminNavItemStoreState.selectedAdminNavItem
    // selectedNavItem: NavItemStoreState.selectedNavItem,
    // loggedIn: UserStoreState.User.loggedIn,
    // id: UserStoreState.User.id,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onSelectNav: (adminNavItemType: AdminNavItemType) =>
      dispatch(actions.selectAdminNavItem(adminNavItemType))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminNavbar)
