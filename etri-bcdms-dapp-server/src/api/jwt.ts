/*
 * Copyright ETRI. All Rights Reserved.
 */
 
import * as express from 'express'
import * as jwt from 'jsonwebtoken'
import { logAPIEnter, logEnterJWT, logExitJWT, logErrorJWT } from './api-logger'

export interface IUserInfo {
  orgName: string
  departmentName: string
  userName: string
}

export interface IRequestWithAuth extends express.Request {
  userInfo: IUserInfo
}

let secret: string
let orgAdminSet: { [orgName: string]: { userName: string; password: string } }

export function configureJWT(secretValue: string, orgAdminSetValue: any) {
  secret = secretValue
  orgAdminSet = orgAdminSetValue
}

// expiresIn - seconds 단위.
export function sign(data: IUserInfo, expiresIn: number): string {
  // data type check
  if (!data.orgName || !data.departmentName || !data.userName) {
    throw Error('required fields are missing')
  }

  // expired type check
  if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
    throw Error('expiresIn is not a proper numeric type')
  }

  return jwt.sign(data, secret, { expiresIn })
}

export function verify(jwtoken: string): Promise<IUserInfo> {
  return new Promise((resolve, reject) => {
    jwt.verify(jwtoken, secret, (err: Error, decoded: IUserInfo) => {
      if (err) {
        reject(err)
      }

      resolve(decoded)
    })
  })
}

export async function handleToken(
  req: IRequestWithAuth,
  res: express.Response,
  next: express.NextFunction
) {
  logEnterJWT(req.path)
  // Check if jwtoken resides in headers authorization section as a bearer token
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const jwtoken = req.headers.authorization.split(' ')[1]
      const decoded = await verify(jwtoken)

      logExitJWT(decoded.orgName, decoded.userName)
      req.userInfo = decoded
      next()
    } else {
      throw Error('There is no bearer token')
    }
  } catch (err) {
    logErrorJWT(err)

    res.status(401).send({
      success: false,
      message: 'failed to verify the JWT',
      payload: err.message
    })
  }
}

export function handleAdminToken(
  req: IRequestWithAuth,
  res: express.Response,
  next: express.NextFunction
) {
  logEnterJWT(req.path)
  // Check if jwtoken resides in headers authorization section as a bearer token
  try {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      const jwtoken = req.headers.authorization.split(' ')[1]
      verify(jwtoken)
        .then(decoded => {
          const { orgName, userName } = decoded

          if (orgAdminSet[orgName].userName !== userName) {
            throw Error('Not the admin user')
          }

          logExitJWT(orgName, userName)
          req.userInfo = decoded
          next()
        })
        .catch(err => {
          logErrorJWT(err)

          res.status(401).send({
            success: false,
            message: 'failed to verify the JWT',
            payload: err.message
          })
        })
    } else {
      throw Error('There is no bearer token')
    }
  } catch (err) {
    logErrorJWT(err)

    res.status(401).send({
      success: false,
      message: 'failed to verify the JWT',
      payload: err.message
    })
  }
}
