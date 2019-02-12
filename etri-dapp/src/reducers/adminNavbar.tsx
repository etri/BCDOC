import { AdminNavItemStoreState, AdminNavItemType } from '../types/index'
import { AdminNavbarAction, AdminNavBarActionType } from '../actions/adminNavbar'

const INITIAL_STATE: AdminNavItemStoreState = {
  selectedAdminNavItem: AdminNavItemType.History
}

export default (
  state: AdminNavItemStoreState = INITIAL_STATE,
  action: AdminNavbarAction
): AdminNavItemStoreState => {
  switch (action.type) {
    case AdminNavBarActionType.SELECT_NAV_ITEM:
      return { ...state, selectedAdminNavItem: action.selectedAdminNavItem }
    default:
      return state
  }
}
