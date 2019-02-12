import * as React from 'react'
import { connect } from 'react-redux'
import { AdminNavItemType } from '../../types/index'
import { History } from '../../types/index'
import { Link } from 'react-router-dom'
import * as actions from '../../actions'

export interface Props {
  history: History
  onSelectNav: (adminNavItemType: AdminNavItemType) => void
  getTxByID: (txID: string, channelID: string) => void
}

function HistoryItem({ history, onSelectNav, getTxByID }: Props) {
  return (
    <React.Fragment>
      <li className="list-group-item">
        <ul className="list-unstyled">
          <li>
            {/* <span className="badge badge-success right-margin-5">{toyyyy(new Date(history.date))}</span> */}
            <span className="badge badge-warning right-margin-5">
              {new Date(history.date).toISOString()}
            </span>
          </li>
          <li>
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link
                  className="nav-link"
                  to={'/admin/transactionSearch'}
                  onClick={() => {
                    onSelectNav(AdminNavItemType.TransactionSearch)
                    getTxByID(history.txID, history.channel)
                  }}
                >
                  <span>{history.txID}</span>
                </Link>
              </li>
              <li className="list-inline-item right">
                <span className="badge badge-secondary text-right" style={{ marginRight: '7px' }}>
                  Channel: {history.channel}
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </React.Fragment>
  )
}

// Wiring up with stores and actions
function mapStateToProps({}) {
  return {}
}

function mapDispatchToProps(dispatch: any) {
  return {
    onSelectNav: (adminNavItemType: AdminNavItemType) =>
      dispatch(actions.selectAdminNavItem(adminNavItemType)),
    getTxByID: (txID: string, channelID: string) =>
      dispatch(actions.getTransactionByID(txID, channelID))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryItem)
