import { UserStoreState } from '../types/index'
import { UserAction, UserActionType } from '../actions/user'

const emptyUser = {
  loggedIn: false,
  orgName: '',
  departmentName: '',
  userID: '',
  jwt: '',
  password: '',
  userName: ''
}

const INITIAL_STATE: UserStoreState = {
  User: emptyUser,
  LoginErrorMsg: '',
  RegisterErrorMsg: '',
  RegisterIsLoading: false
}

export default (state: UserStoreState = INITIAL_STATE, action: UserAction): UserStoreState => {
  switch (action.type) {
    case UserActionType.LOGIN_SUCCESS:
      return { ...state, User: action.user, LoginErrorMsg: '' }

    case UserActionType.LOGIN_FAILURE:
      return { ...state, User: emptyUser, LoginErrorMsg: action.loginErrorMsg }

    case UserActionType.LOGOUT:
      return { ...state, User: emptyUser }

    case UserActionType.REGISTER_REQUEST:
      return { ...state, RegisterErrorMsg: '', RegisterIsLoading: true }

    case UserActionType.REGISTER_REQUEST_SUCCESS:
      return { ...state, RegisterIsLoading: false }

    case UserActionType.REGISTER_REQUEST_FAIL:
      return { ...state, RegisterErrorMsg: action.registerErrorMsg }

    default:
      return state
  }
}
