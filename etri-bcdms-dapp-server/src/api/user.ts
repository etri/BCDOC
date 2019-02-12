/*
 * Copyright ETRI. All Rights Reserved.
 */

import * as express from 'express'
import { IFabricGateway } from '../blockchain/fabric'
import { logAPIEnter } from './api-logger'
import * as jwtLib from './jwt'
import * as userDB from '../db/user'
import * as txDB from '../db/transaction'

const REGISTER = '/user'
const LOGIN = '/user/:userID'
const GET_USER = '/user/:userID'

export default function configure(app: express.Application, gateway: IFabricGateway) {
  app.post(REGISTER, getRegisterHandler(gateway))
  app.post(LOGIN, getLoginHandler(gateway))
  app.get(GET_USER, getUserHandler(gateway))
}

export function getRegisterHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { orgName, departmentName, userID, userName, password } = req.body

    logAPIEnter('Register', req.path, { orgName, departmentName, userID, userName, password })

    try {
      await gateway.userManager.register({ orgName, departmentName, userName: userID, password })

      // Create a user on tokench
      // Send to CC
      const channelName = 'tokench'
      const contractName = 'etri-bcdms-token-chaincode'
      const functionName = 'CREATE_USER_TOKEN_INFO'
      const args = [JSON.stringify({ userID, userName })]

      const response = await gateway.contractManager.invoke({
        channelName,
        contractName,
        functionName,
        args,
        isAdmin: true
      })
      if (!response) {
        throw Error('empty response from the chaincode')
      }

      const payload = JSON.parse(response)
      if (!payload.success) {
        throw Error('wrong payload')
      }

      // Save txID
      await txDB.createTransaction(payload.txID, channelName)

      // Save to the off-chain DB
      await userDB.createUser({ id: userID, name: userName, orgName, departmentName })

      res.status(200).send({
        success: true,
        message: 'Successfully register the user',
        payload: { orgName, departmentName, userName }
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to register the user',
        payload: err.message
      })
    }
  }
}

export function getLoginHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    let { jwt } = req.body
    const { password } = req.body
    const { userID } = req.params

    try {
      // Load user from the off-chain DB
      const user = await userDB.readUser(userID)
      if (!user) {
        throw Error('no such user')
      }

      let orgName = user.orgName
      let departmentName = user.departmentName

      if (jwt) {
        const userInfo = await jwtLib.verify(jwt)

        if (userID !== userInfo.userName) {
          throw Error('invalid login token')
        }

        orgName = userInfo.orgName
        departmentName = userInfo.departmentName
      } else {
        await gateway.userManager.login({ orgName, departmentName, userName: userID, password })
      }

      logAPIEnter('Login', req.path, { orgName, departmentName, userName: userID, password, jwt })

      const expiresIn = 60 * 60 // 1h
      jwt = jwtLib.sign({ orgName, departmentName, userName: userID }, expiresIn)
      res.status(200).send({
        success: true,
        message: 'Successfully login the user',
        payload: {
          userID,
          orgName,
          departmentName,
          jwt,
          userName: user.name
        }
      })
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to login the user',
        payload: err.message
      })
    }
  }
}

export function getUserHandler(gateway: IFabricGateway) {
  return async (req: express.Request, res: express.Response) => {
    const { userID } = req.params

    logAPIEnter('Get-user', req.path, { userID })

    try {
      // Get the user from the DB
      const user: { id: string; name: string } = await userDB.readUser(userID)

      if (user) {
        res.status(200).send({
          success: true,
          message: 'successfully get the user information',
          payload: { id: user.id, name: user.name }
        })
      } else {
        throw Error('no such user')
      }
    } catch (err) {
      res.status(400).send({
        success: false,
        message: 'failed to get the user',
        payload: err.message
      })
    }
  }
}
