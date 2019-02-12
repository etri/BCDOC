import { userApi } from '../api/index'
import { User } from '../types/index'

export enum UserActionType {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_REQUEST_SUCCESS = 'REGISTER_REQUEST_SUCCESS',
  REGISTER_REQUEST_FAIL = 'REGISTER_REQUEST_FAIL'
}

export interface UserAction {
  type: UserActionType
  user: User
  registerErrorMsg: string
  loginErrorMsg: string
}

export function login(id: string, orgName: string, departmentName: string, password: string) {
  return async (dispatch: any) => {
    try {
      const user: User = await userApi.login(id, orgName, departmentName, password)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({
        type: UserActionType.LOGIN_SUCCESS,
        user: user
      })
      console.log('login success')
    } catch (error) {
      localStorage.removeItem('user')
      dispatch({
        type: UserActionType.LOGIN_FAILURE,
        loginErrorMsg: error.toString()
      })
      console.log('login fail')
    }
  }
}

export function initUser() {
  return async (dispatch: any) => {
    console.log('init user')
    try {
      const userString = localStorage.getItem('user')
      if (userString) {
        const user: User = JSON.parse(userString)
        console.log('get from local:', user)
        const u: User = await userApi.loginWithJWT(user.userID, user.jwt)
        console.log('logged in:', u)
        localStorage.setItem('user', JSON.stringify(u))
        dispatch({
          type: UserActionType.LOGIN_SUCCESS,
          user: u
        })
      }
    } catch (error) {
      console.log('init fail', error.toString())
      localStorage.removeItem('user')
      dispatch({
        type: UserActionType.LOGIN_FAILURE
      })
    }
  }
}

export function logout() {
  return async (dispatch: any) => {
    localStorage.removeItem('user')
    dispatch({
      type: UserActionType.LOGOUT
    })
  }
}

export function register(
  userID: string,
  userName: string,
  orgName: string,
  departmentName: string,
  password: string
) {
  return async (dispatch: any) => {
    dispatch({
      type: UserActionType.REGISTER_REQUEST
    })

    try {
      const u: User = await userApi.register(userID, userName, orgName, departmentName, password)
      dispatch({
        type: UserActionType.REGISTER_REQUEST_SUCCESS
      })

      const user: User = await userApi.login(userID, u.orgName, u.departmentName, password)
      localStorage.setItem('user', JSON.stringify(user))
      dispatch({
        type: UserActionType.LOGIN_SUCCESS,
        user: user
      })
    } catch (error) {
      localStorage.removeItem('user')
      dispatch({
        type: UserActionType.REGISTER_REQUEST_FAIL,
        registerErrorMsg: error.toString()
      })
    }
  }
}

export function setRegisterErrorMsg(msg: string) {
  return async (dispatch: any) => {
    dispatch({
      type: UserActionType.REGISTER_REQUEST_FAIL,
      registerErrorMsg: msg
    })
  }
}
