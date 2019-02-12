export interface RootState {
  NavItemStoreState: NavItemStoreState
  DocumentsStoreState: DocumentsStoreState
  UserStoreState: UserStoreState
  CommonStoreState: CommonStoreState
  TokenStoreState: TokenStoreState
  AdminNavItemStoreState: AdminNavItemStoreState
  BlockStoreState: BlockStoreState
  TransactionStoreState: TransactionStoreState
}

export interface TransactionStoreState {
  transaction: Transaction | undefined
  transactionList: History[] | undefined
  errorMsg: string
}

export interface BlockStoreState {
  block: Block
  errorMsg: string
}

export interface NavItemStoreState {
  selectedNavItem: NavItemType
  index: number
}

export interface AdminNavItemStoreState {
  selectedAdminNavItem: AdminNavItemType
}

export enum NavItemType {
  TechnicalDocument = 1,
  Paper,
  Patent,
  ResearchReport,
  Book,
  InternationalStandard
}

export enum AdminNavItemType {
  History,
  BlockSearch,
  TransactionSearch
}

export interface TechnicalDocument {
  ID: string
  Author: string
  Year: string
  Title: string
  Rating: number
  Comments: Comment[]
}

export enum DocumentType {
  DocTypeTechnicalDoc = 'technical-document',
  DocTypeJournal = 'paper-document',
  DocTypePatent = 'patent-document',
  DocTypeReport = 'report-document',
  DocTypeBook = 'book-document',
  DocTypeStandard = 'standard-document'
}

export interface Comment {
  Rating: number
  Content: string
  Writer: string
}

export interface DocumentsStoreState {
  Documents: Document[]
  SelectedDoc: Document
  CreateDocumentIsLoading: boolean
  EvaluateIsLoading: boolean
  ErrorMsg: string
}

export enum TransactionType {
  CREATE_DOCUMENT = 'badge-primary',
  EVALUATAION = 'badge-success',
  DEPOSIT = 'badge-info',
  WITHDRAW = 'badge-warning'
}

export interface Transaction {
  Type: TransactionType
  Amount: number
  Date: Date
}

export interface User {
  orgName: string
  userName: string
  departmentName: string
  userID: string
  loggedIn: boolean
  jwt: string
  password: string
}

export interface UserStoreState {
  User: User
  LoginErrorMsg: string
  RegisterErrorMsg: string
  RegisterIsLoading: boolean
}

export interface Author {
  id: string
  name: string
}

export interface Document {
  id: string
  type: string
  title: string
  issueDate: number
  authorList: string
  projectID: string
  fileName: string
  version: string
  hashValue: string
  evaluationList: Evaluation[]
  score: number
  versionList?: any[]
}

export interface Version {}

export interface ResponseBody {
  success: boolean
  message: string
  payload: any
}

export interface Evaluation {
  id: string
  score: number
  comment: string
  data: number
  documentID: string
  documentHashValue: string
  evaluatorID: string
}

export interface QueryTokenResponse {
  txID: string
  userTokenInfo: UserTokenInfo
}

export interface UserTokenInfo {
  id: string
  name: string
  balance: number
  history: Deal[]
}

export interface Deal {
  id: string
  amount: number
  txID: string
  dealType: number
  refID: string
  date: number
}

export interface CommonStoreState {
  isLoading: boolean
}

export interface TokenStoreState {
  token: UserTokenInfo
  errorMsg: string
}

export interface History {
  // blockID: string,
  txID: string
  // content: string,
  date: number
  channel: string
}

export interface Block {
  header: {
    number: number
    previous_hash: string
    data_hash: string
  }
  data: {
    data: BlockData[]
  }
}

export interface BlockData {
  signature: {
    data: Buffer[]
  }
  payload: {
    header: {
      channel_header: {
        channel_id: string
        tx_id: string
      }
    }
    data: {
      actions: Action[]
    }
  }
}

export interface Action {
  header: {
    creator: {
      Mspid: string
    }
  }
  payload: {
    action: {
      proposal_response_payload: {
        extension: {
          results: {
            ns_rwset: NsRWSet[]
          }
        }
      }
    }
  }
}

export interface NsRWSet {
  namespace: string
  rwset: {
    reads: Read[]
    writes: Write[]
  }
}

export interface Read {
  key: string
}

export interface Write {
  key: string
  value: string
}

export interface Transaction {
  transactionEnvelope: BlockData
  validationCode: number
}
