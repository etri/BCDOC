/*
 * Copyright ETRI. All Rights Reserved.
 */

import { InsertOneWriteOpResult, FindAndModifyWriteOpResultObject } from 'mongodb'
import getDB from '.'
import { logDBWrite, logDBRead } from './db-logger'

const COL_USER = 'user'

export async function createUser(newUser: any): Promise<InsertOneWriteOpResult> {
  const db = getDB()

  logDBWrite(db.databaseName, COL_USER, newUser)
  return db.collection(COL_USER).insertOne(newUser)
}

export async function readUser(userID: string): Promise<any> {
  const db = getDB()

  logDBRead(db.databaseName, COL_USER, userID)
  return db.collection(COL_USER).findOne({ id: userID })
}

export async function exists(userID: string): Promise<boolean> {
  const db = getDB()

  logDBRead(db.databaseName, COL_USER, userID)
  const user = await db.collection(COL_USER).findOne({ id: userID })
  return user ? true : false
}
