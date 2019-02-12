/*
 * Copyright ETRI. All Rights Reserved.
 */
 
import getDB from '.'
import { logDBWrite, logDBRead } from './db-logger'

const COL_TRANSACTION = 'transaction'

export async function createTransaction(txID: string, channelID: string): Promise<any> {
  const db = getDB()

  logDBWrite(db.databaseName, COL_TRANSACTION, txID)

  return db.collection(COL_TRANSACTION).insert({ txID, date: Date.now(), channel: channelID })
}

export async function readTransactionListWithRange(startIdx: number, endIdx: number): Promise<any> {
  const db = getDB()

  logDBRead(db.databaseName, COL_TRANSACTION, `startIdx: ${startIdx}, endIdx: ${endIdx}`)
  return db
    .collection(COL_TRANSACTION)
    .find()
    .sort({ date: -1 })
    .skip(startIdx)
    .limit(10)
    .toArray()
}
