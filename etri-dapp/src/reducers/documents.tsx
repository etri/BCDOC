import { DocumentsStoreState, Evaluation } from '../types'
import { DocumentAction, DocumentActionType } from '../actions/document'
import { Document } from '../types/index'

const INITIAL_STATE: DocumentsStoreState = {
  Documents: [],
  SelectedDoc: {} as Document,
  CreateDocumentIsLoading: false,
  EvaluateIsLoading: false,
  ErrorMsg: ''
}

export default (
  state: DocumentsStoreState = INITIAL_STATE,
  action: DocumentAction
): DocumentsStoreState => {
  switch (action.type) {
    case DocumentActionType.SELECT_DOC:
      return { ...state, SelectedDoc: action.selectedDocument }

    case DocumentActionType.FETCH_SUCCESS:
      return { ...state, Documents: action.documents }

    case DocumentActionType.FETCH_FAIL:
      return { ...state, Documents: [] }

    case DocumentActionType.CREATE:
      return { ...state, CreateDocumentIsLoading: true, ErrorMsg: '' }

    case DocumentActionType.CREATE_SUCCESS:
      return { ...state, CreateDocumentIsLoading: false, ErrorMsg: '' }

    case DocumentActionType.CREATE_FAIL:
      return { ...state, CreateDocumentIsLoading: false, ErrorMsg: action.createErrorMsg }

    case DocumentActionType.EVALUATE_REQUEST:
      return { ...state, EvaluateIsLoading: true, ErrorMsg: '' }

    case DocumentActionType.EVALUATE_REQUEST_SUCCESS:
      return {
        ...state,
        EvaluateIsLoading: false,
        SelectedDoc: addEvaluationToDoc(state.SelectedDoc, action.evaluation),
        ErrorMsg: ''
      }

    case DocumentActionType.CREATE_FAIL:
      return { ...state, EvaluateIsLoading: false, ErrorMsg: action.evaluateErrorMsg }

    default:
      return state
  }
}

function addEvaluationToDoc(document: Document, evaluation: Evaluation): Document {
  let newDocument: Document = JSON.parse(JSON.stringify(document))
  if (!newDocument.evaluationList) {
    newDocument.evaluationList = [evaluation]
  } else {
    newDocument.evaluationList.splice(0, 0, evaluation)
  }

  return newDocument
}
