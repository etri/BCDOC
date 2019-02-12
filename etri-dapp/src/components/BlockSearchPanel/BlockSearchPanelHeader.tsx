import * as React from 'react'

export interface Props {
  blockHeight: number
  prevHash: string
  currentHash: string
}

function BlockSearchPanelHeader({ blockHeight, prevHash, currentHash }: Props) {
  return (
    <React.Fragment>
      <ul className="list-group">
        <li className="list-group-item">Block height: {blockHeight}</li>
        <li className="list-group-item">Prev hash: {prevHash}</li>
        <li className="list-group-item">Current hsh: {currentHash}</li>
      </ul>
    </React.Fragment>
  )
}

export default BlockSearchPanelHeader
