import * as React from 'react'
import { BlockData } from '../../types/index'

export interface Props {
  transaction: BlockData
}

function TransactionItem({ transaction }: Props) {
  if (!transaction) return null
  if (!transaction.payload.data.actions) return <p>No Actions</p>

  return (
    <React.Fragment>
      <ul className="list-group">
        <li className="list-group-item">
          <span>TxID: {transaction.payload.header.channel_header.tx_id}</span>
        </li>
        <li className="list-group-item">
          <b>Writes: </b>
          <ul className="list-group">
            {transaction.payload.data.actions.map((data, index, list) => {
              return data.payload.action.proposal_response_payload.extension.results.ns_rwset.map(
                (data, index, list) => {
                  return data.rwset.writes.map((data, index, list) => {
                    return (
                      <li className="list-group-item" key={index}>
                        Key: {data.key}
                        <br />
                        Value: {data.value}
                      </li>
                    )
                  })
                }
              )
            })}
          </ul>
        </li>
        <li className="list-group-item">
          <b>Reads: </b>
          <ul className="list-group">
            {transaction.payload.data.actions.map((data, index, list) => {
              return data.payload.action.proposal_response_payload.extension.results.ns_rwset.map(
                (data, index, list) => {
                  return data.rwset.reads.map((data, index, list) => {
                    return (
                      <li className="list-group-item" key={index}>
                        Key: {data.key}
                      </li>
                    )
                  })
                }
              )
            })}
          </ul>
        </li>
      </ul>
    </React.Fragment>
  )
}

export default TransactionItem
