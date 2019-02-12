import * as React from 'react'
import { Deal } from '../../types/index'
import Badge from '../BadgeList/Badge'
import { TransactionType } from 'src/types'
import TransactionModal from '../TransactionModal/TransactionModal'

export interface Props {
  deal: Deal
}

function DealItem({ deal }: Props) {
  const modalID = deal.id.replace('.', '-')

  return (
    <React.Fragment>
      <li className="list-group-item">
        <ul className="list-inline col-md-12 padding-5">
          <li className="list-inline-item">
            <span style={{ color: '#000000', fontSize: '16px' }}>
              {new Date(deal.date).toISOString()}
            </span>
          </li>
          <li className="list-inline-item">
            <span style={{ fontSize: '20px' }}>
              <b>{getAmountText(deal.amount)}</b>
            </span>
          </li>
          <li className="list-inline-item right">
            <a href="#" data-toggle="modal" data-target={`#${modalID}`}>
              <Badge type={getDealType(deal.dealType, deal.amount)} />
            </a>
          </li>
        </ul>
      </li>
      <TransactionModal modalId={modalID} deal={deal} />
    </React.Fragment>
  )
}

function getDealType(type: number, amount: number): TransactionType {
  switch (type) {
    case 0:
      return TransactionType.CREATE_DOCUMENT
    case 1:
      return TransactionType.EVALUATAION
    case 3:
      if (amount >= 0) {
        return TransactionType.DEPOSIT
      } else {
        return TransactionType.WITHDRAW
      }
    default:
      return TransactionType.CREATE_DOCUMENT
  }
}

function getAmountText(amount: number): any {
  if (amount >= 0) {
    return <span style={{ color: '#3A8EED' }}>{'+' + amount}</span>
  }
  return <span style={{ color: '#F26077' }}>{amount}</span>
}

export default DealItem
