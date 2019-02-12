export enum CommonActionType {
  START_LOADING = 'START_LOADING',
  END_LOADING = 'END_LOADING'
}

export interface CommonAction {
  type: CommonActionType
}
