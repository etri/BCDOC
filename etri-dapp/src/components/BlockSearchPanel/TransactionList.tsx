import * as React from 'react'
import { BlockData } from '../../types/index'
import TransactionItem from './TransactionItem'

export interface Props {
  transactionList: BlockData[]
}

function TransactionList({ transactionList }: Props) {
  if (!transactionList) return null
  if (!transactionList.length) return <p>No Transactions</p>

  return (
    <React.Fragment>
      {transactionList.map(function(blockData, i) {
        if (!blockData) return null
        return <TransactionItem transaction={blockData} key={i} />
      })}
    </React.Fragment>
  )
}

export default TransactionList
