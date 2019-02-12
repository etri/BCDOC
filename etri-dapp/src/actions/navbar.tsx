import { NavItemType } from '../types/index'

export interface NavbarAction {
  type: NavbarActionType
  selectedNavItemType: NavItemType
}

export enum NavbarActionType {
  SELECT_NAV_ITEM = 'SELECT_NAV_ITEM',
  INCREMENT_INDEX = 'INCREMENT_INDEX',
  DECREMENT_INDEX = 'DECREMENT_INDEX'
}

// Actions
export function selectNavItem(navItemType: NavItemType) {
  return async (dispatch: any) => {
    dispatch({
      type: NavbarActionType.SELECT_NAV_ITEM,
      selectedNavItemType: navItemType
    })
  }
}
