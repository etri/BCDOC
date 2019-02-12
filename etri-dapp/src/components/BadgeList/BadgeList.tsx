import * as React from 'react'
import Badge from './Badge'
import { TransactionType } from 'src/types'

export interface Props {
  badges: { type: TransactionType }[]
}

function BadgeList({ badges }: Props) {
  return (
    <React.Fragment>
      <div style={{ padding: '10px' }}>
        {badges.map((badge, i) => {
          return <Badge key={i} type={badge.type} />
        })}
      </div>
    </React.Fragment>
  )
}

export default BadgeList
