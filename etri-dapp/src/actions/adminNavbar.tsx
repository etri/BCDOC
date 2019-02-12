import { AdminNavItemType } from '../types/index'

export enum AdminNavBarActionType {
  SELECT_NAV_ITEM = 'SELECT_ADMIN_NAV_ITEM'
}

export interface AdminNavbarAction {
  type: AdminNavBarActionType
  selectedAdminNavItem: AdminNavItemType
}

// Actions
export function selectAdminNavItem(adminNavItem: AdminNavItemType): AdminNavbarAction {
  return {
    type: AdminNavBarActionType.SELECT_NAV_ITEM,
    selectedAdminNavItem: adminNavItem
  }
}
