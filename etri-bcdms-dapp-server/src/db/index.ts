/*
 * Copyright ETRI. All Rights Reserved.
 */

import { MongoClient, Db } from 'mongodb'
import { logError, logDBConnect } from './db-logger'

let db: Db

export async function connectDB() {
  try {
    const dbClient = await MongoClient.connect(
      process.env.DB_URI,
      { useNewUrlParser: true }
    )

    db = dbClient.db()
    if (!db) {
      throw Error('empty DB object returned')
    }

    logDBConnect(db.databaseName, process.env.DB_URI)
  } catch (err) {
    logError('failed to connect the DB', err)
    throw err
  }
}

export default function getDB(): Db {
  return db
}
