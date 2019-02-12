import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import registerServiceWorker from './registerServiceWorker'
import App from './components/App'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import navbar from './reducers/navbar'
import documents from './reducers/documents'
import user from './reducers/user'
import common from './reducers/common'
import token from './reducers/token'
import adminNavbar from './reducers/adminNavbar'
import block from './reducers/block'
import transaction from './reducers/transaction'
import { RootState } from './types'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faStar,
  faSearch,
  faPencilAlt,
  faWallet,
  faSpinner,
  faCog,
  faArrowLeft,
  faUser,
  faDownload
} from '@fortawesome/free-solid-svg-icons'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import 'bootstrap'
import { config } from './api/index'

library.add(
  fab,
  faStar,
  faSearch,
  faPencilAlt,
  faWallet,
  faSpinner,
  faCog,
  faArrowLeft,
  faUser,
  faDownload
)

// todo combine reducers
const rootReducers = combineReducers<RootState>({
  CommonStoreState: common,
  NavItemStoreState: navbar,
  DocumentsStoreState: documents,
  UserStoreState: user,
  TokenStoreState: token,
  AdminNavItemStoreState: adminNavbar,
  BlockStoreState: block,
  TransactionStoreState: transaction
})

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(rootReducers, composeEnhancers(applyMiddleware(thunk)))
config.setupInterceptors(store)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
)

registerServiceWorker()
