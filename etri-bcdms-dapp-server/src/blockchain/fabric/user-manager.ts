/*
 * Copyright ETRI. All Rights Reserved.
 */
 
import { User } from 'fabric-client'
import * as user from './sdk/user'

export interface IFabricUserManager {
  register(params: IUserParams): Promise<void>
  login(params: IUserParams): Promise<User>
}

export interface IUserParams {
  orgName: string
  departmentName: string
  userName: string
  password: string
}

export class UserManager implements IFabricUserManager {
  public async register({
    orgName,
    departmentName,
    userName,
    password
  }: IUserParams): Promise<void> {
    return await user.registerUser(orgName, departmentName, userName, password)
  }

  public async login({ orgName, departmentName, userName, password }: IUserParams): Promise<User> {
    return await user.loginUser(orgName, departmentName, userName, password)
  }
}
