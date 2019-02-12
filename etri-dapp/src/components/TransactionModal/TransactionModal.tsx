import * as React from 'react'
import { Deal, AdminNavItemType } from '../../types/index'
import { Link } from 'react-router-dom'
import * as actions from '../../actions'
import { connect } from 'react-redux'

export interface Props {
  deal: Deal
  modalId: string
  onSelectNav: (adminNavItemType: AdminNavItemType) => void
  getTxByID: (txID: string, channelID: string) => void
}

function TransactionModal({ deal, modalId, onSelectNav, getTxByID }: Props) {
  let refRow = []
  const channel = deal.refID ? 'evaluationch' : 'tokench'

  if (deal.refID) {
    if (deal.dealType === 1) {
      refRow.push(
        <div
          className="col-md-2"
          style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
        >
          <span style={{ fontSize: 14, color: '#000000' }}>
            <b>평가 ID</b>
          </span>
        </div>
      )
    } else {
      refRow.push(
        <div
          className="col-md-2"
          style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
        >
          <span style={{ fontSize: 14, color: '#000000' }}>
            <b>문서 ID</b>
          </span>
        </div>
      )
    }

    refRow.push(
      <div
        className="col-md-10"
        style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
      >
        <span style={{ fontSize: 14, color: '#000000' }}>{deal.refID}</span>
      </div>
    )
  }

  return (
    <div className="modal fade" id={modalId} role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              <span style={{ color: '#000000' }}>
                <b>{getLabel(deal.dealType, deal.amount)}</b>
              </span>
            </h4>
            <button type="button" className="close" data-dismiss="modal">
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="row">{refRow}</div>
            <div className="row">
              <div
                className="col-md-2"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 14, color: '#000000' }}>
                  <b>수행일</b>
                </span>
              </div>
              <div
                className="col-md-10"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 14, color: '#000000' }}>
                  {new Date(deal.date).toISOString()}
                </span>
              </div>
            </div>
            <div className="row">
              <div
                className="col-md-2"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <span style={{ fontSize: 14, color: '#000000' }}>
                  <b>Transaction ID</b>
                </span>
              </div>
              <div
                className="col-md-10"
                style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
              >
                <Link
                  className="nav-link"
                  to={'/admin/transactionSearch'}
                  onClick={() => {
                    onSelectNav(AdminNavItemType.TransactionSearch)
                    getTxByID(deal.txID, channel)
                  }}
                >
                  <span style={{ fontSize: 10, color: '#000000' }}>{deal.txID}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getLabel(type: number, amount: number): string {
  switch (type) {
    case 0:
      return '문서 작성'
    case 1:
      return '평가 수행'
    case 3:
      if (amount >= 0) {
        return '입금'
      } else {
        return '출금'
      }
    default:
      return '문서 작성'
  }

  return 'error'
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
)(TransactionModal)
