import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SizeProp } from '@fortawesome/fontawesome-svg-core'

export interface Props {
  number: number
  color?: string
  size?: SizeProp
}

function StarRating({ number, size = 'xs', color = '#508CE6' }: Props) {
  return (
    <React.Fragment>
      {Array.from(Array(number), (e, i) => {
        return <FontAwesomeIcon key={i} icon="star" size={size} color={color} />
      })}
    </React.Fragment>
  )
}

export default StarRating
