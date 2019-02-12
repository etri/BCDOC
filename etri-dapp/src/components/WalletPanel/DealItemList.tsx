import * as React from 'react'
import { Deal } from '../../types/index'
import DealItem from './DealItem'

export interface Props {
  dealList: Deal[]
}

function DealItemList({ dealList }: Props) {
  return (
    <React.Fragment>
      {dealList && (
        <ul className="list-group">
          {dealList.map((deal, i) => {
            return <DealItem deal={deal} key={i} />
          })}
        </ul>
      )}
    </React.Fragment>
  )
}

export default DealItemList
