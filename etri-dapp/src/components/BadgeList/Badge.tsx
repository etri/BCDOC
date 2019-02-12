import * as React from 'react'
import { TransactionType } from '../../types/index'

export interface Props {
  type: TransactionType
}

function Badge({ type }: Props) {
  return (
    <React.Fragment>
      <span
        style={{
          display: 'inline-block',
          width: '80px',
          height: '25px',
          fontSize: '15px',
          marginLeft: '7px',
          marginRight: '7px'
        }}
        className={'badge ' + type}
      >
        <b>{getLabel(type)}</b>
      </span>
    </React.Fragment>
  )
}

function getLabel(type: TransactionType): string {
  switch (type) {
    case TransactionType.CREATE_DOCUMENT:
      return '문서 작성'
    case TransactionType.EVALUATAION:
      return '평가 수행'
    case TransactionType.DEPOSIT:
      return '입금'
    case TransactionType.WITHDRAW:
      return '출금'
  }

  return 'error'
}

export default Badge
