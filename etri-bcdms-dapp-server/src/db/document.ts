/*
 * Copyright ETRI. All Rights Reserved.
 */
 
import { InsertOneWriteOpResult, FindAndModifyWriteOpResultObject } from 'mongodb'
import getDB from '.'
import { logDBWrite, logDBRead } from './db-logger'

const COL_DOCUMENT = 'document'

export async function createOrUpdateDocument(newDocument: any): Promise<any> {
  const db = getDB()

  logDBWrite(db.databaseName, COL_DOCUMENT, newDocument)

  return db
    .collection(COL_DOCUMENT)
    .updateOne({ id: newDocument.id }, { $set: newDocument }, { upsert: true })
}

export async function readDocument(documentID: string): Promise<any> {
  const db = getDB()

  logDBRead(db.databaseName, COL_DOCUMENT, documentID)
  return db.collection(COL_DOCUMENT).findOne({ id: documentID })
}

export async function readDocumentList(documentIDList: string[]): Promise<any[]> {
  const db = getDB()

  logDBRead(db.databaseName, COL_DOCUMENT, documentIDList)
  return db
    .collection(COL_DOCUMENT)
    .find({ id: { $in: documentIDList } })
    .sort({ timestamp: -1 })
    .toArray()
}

export async function updateDocument(
  documentID: string,
  newDocument: any
): Promise<FindAndModifyWriteOpResultObject> {
  const db = getDB()

  logDBWrite(db.databaseName, COL_DOCUMENT, newDocument)
  return db.collection(COL_DOCUMENT).findOneAndUpdate({ id: documentID }, newDocument)
}
