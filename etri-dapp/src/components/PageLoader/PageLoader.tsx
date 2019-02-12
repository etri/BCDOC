import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface Props {}

function PageLoader({  }: Props) {
  return (
    <React.Fragment>
      <FontAwesomeIcon icon="spinner" className="fa-spin" size="2x" />
    </React.Fragment>
  )
}

export default PageLoader
