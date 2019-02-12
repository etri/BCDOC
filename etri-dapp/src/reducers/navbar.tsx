import { NavItemStoreState, NavItemType } from '../types/index'
import { NavbarActionType, NavbarAction } from '../actions/navbar'

const INITIAL_STATE: NavItemStoreState = {
  selectedNavItem: NavItemType.TechnicalDocument,
  index: 0
}

export default (
  state: NavItemStoreState = INITIAL_STATE,
  action: NavbarAction
): NavItemStoreState => {
  switch (action.type) {
    case NavbarActionType.SELECT_NAV_ITEM:
      return { ...state, selectedNavItem: action.selectedNavItemType }
    case NavbarActionType.INCREMENT_INDEX:
      return { ...state, index: state.index + 10 }
    case NavbarActionType.DECREMENT_INDEX:
      return { ...state, index: state.index - 10 }
    default:
      return state
  }
}
