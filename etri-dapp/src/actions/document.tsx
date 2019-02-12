import { documentApi } from 'src/api'
import { DocumentType, Document, Author } from '../types/index'
import { CommonActionType } from './common'
import { evaluationApi } from '../api/index'
import * as $ from 'jquery'
import { Evaluation } from '../types/index'
import { NavbarActionType } from './navbar'

export enum DocumentActionType {
  SELECT_DOC = 'SELECT_DOC',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAIL = 'FETCH_FAIL',
  CREATE = 'CREATE',
  CREATE_SUCCESS = 'CREATE_SUCCESS',
  CREATE_FAIL = 'CREATE_FAIL',
  EVALUATE_REQUEST = 'EVALUATE_REQUEST',
  EVALUATE_REQUEST_FAIL = 'EVALUATE_REQUEST_FAIL',
  EVALUATE_REQUEST_SUCCESS = 'EVALUATE_REQUEST_SUCCESS'
}

export interface DocumentAction {
  type: DocumentActionType
  selectedDocument: Document
  documents: Document[]
  evaluateErrorMsg: string
  createErrorMsg: string
  evaluation: Evaluation
}

export function next(type: DocumentType, currentIndex: number) {
  return async (dispatch: any) => {
    dispatch({
      type: CommonActionType.START_LOADING
    })

    dispatch({
      type: NavbarActionType.INCREMENT_INDEX
    })

    try {
      console.log('success: fetch doc')
      const documents: Document[] = await documentApi.getDocuments(
        type,
        currentIndex + 10,
        currentIndex + 20
      )
      console.log(documents)
      dispatch({
        type: DocumentActionType.FETCH_SUCCESS,
        documents: documents
      })
    } catch (error) {
      console.log('error: fetch doc')
      dispatch({
        type: DocumentActionType.FETCH_FAIL
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to fetch doc')
  }
}

export function previous(type: DocumentType, currentIndex: number) {
  return async (dispatch: any) => {
    dispatch({
      type: CommonActionType.START_LOADING
    })

    dispatch({
      type: NavbarActionType.DECREMENT_INDEX
    })

    try {
      console.log('success: fetch doc')
      const documents: Document[] = await documentApi.getDocuments(
        type,
        currentIndex - 10,
        currentIndex
      )
      console.log(documents)
      dispatch({
        type: DocumentActionType.FETCH_SUCCESS,
        documents: documents
      })
    } catch (error) {
      console.log('error: fetch doc')
      dispatch({
        type: DocumentActionType.FETCH_FAIL
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to fetch doc')
  }
}

export function selectDoc(document: Document) {
  return async (dispatch: any) => {
    console.log('start to fetch a doc')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      console.log('success: fetch a doc')
      const versionedDocument: any = await documentApi.getDocument(document.type, document.id)

      document.versionList = versionedDocument.versionList

      dispatch({
        type: DocumentActionType.SELECT_DOC,
        selectedDocument: document
      })
    } catch (error) {
      console.log('error: fetch a doc')
      dispatch({
        type: DocumentActionType.FETCH_FAIL
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to fetch a doc')
  }
}

export function getDocuments(type: DocumentType, startIndex: number, endIndex: number) {
  return async (dispatch: any) => {
    console.log('start to fetch doc')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      console.log('success: fetch doc')
      const documents: Document[] = await documentApi.getDocuments(type, startIndex, endIndex)
      console.log(documents)
      dispatch({
        type: DocumentActionType.FETCH_SUCCESS,
        documents: documents
      })
    } catch (error) {
      console.log('error: fetch doc')
      dispatch({
        type: DocumentActionType.FETCH_FAIL
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to fetch doc')
  }
}

export function createDocument(
  title: string,
  authorList: Author[],
  projectID: string,
  version: string,
  docType: DocumentType,
  documentFile: File
) {
  return async (dispatch: any) => {
    console.log('start to create document')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      await documentApi.createDocument(
        title,
        authorList,
        projectID,
        version,
        new Date().getTime(),
        docType,
        documentFile
      )
      dispatch({
        type: DocumentActionType.CREATE_SUCCESS
      })
    } catch (error) {
      console.log('fail to  document', error)
      dispatch({
        type: DocumentActionType.CREATE_FAIL,
        createErrorMsg: error.toString()
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to create document')
  }
}

export function updateDocument(
  id: string,
  title: string,
  authorList: Author[],
  projectID: string,
  version: string,
  docType: string,
  documentFile: File
) {
  return async (dispatch: any) => {
    console.log('start to create document')
    dispatch({
      type: CommonActionType.START_LOADING
    })

    try {
      await documentApi.updateDocument(
        id,
        title,
        authorList,
        projectID,
        version,
        new Date().getTime(),
        docType,
        documentFile
      )
      dispatch({
        type: DocumentActionType.CREATE_SUCCESS
      })
    } catch (error) {
      console.log('fail to  document', error)
      dispatch({
        type: DocumentActionType.CREATE_FAIL
      })
    }

    dispatch({
      type: CommonActionType.END_LOADING
    })
    console.log('end to create document')
  }
}

export function evaluate(
  id: string,
  documentID: string,
  comment: string,
  score: number,
  documentHashValue: string,
  resetState: () => void
) {
  return async (dispatch: any) => {
    dispatch({
      type: DocumentActionType.EVALUATE_REQUEST
    })

    try {
      const evaluation: Evaluation = await evaluationApi.evaluate(
        id,
        score,
        comment,
        Date.now(),
        documentID,
        documentHashValue
      )
      console.log('created evaluation: ', evaluation)

      dispatch({
        type: DocumentActionType.EVALUATE_REQUEST_SUCCESS,
        evaluation: evaluation
      })
      resetState()
    } catch (error) {
      console.log(error)
      dispatch({
        type: DocumentActionType.EVALUATE_REQUEST_FAIL,
        evaluateErrorMsg: error.toString()
      })
    }

    $('.close').click()
  }
}
