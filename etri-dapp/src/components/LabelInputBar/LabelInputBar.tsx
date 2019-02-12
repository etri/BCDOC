import * as React from 'react'

export interface Props {
  label: string
  onChangeFunc: (value: string) => void
}

function LabelInputBar({ label, onChangeFunc }: Props) {
  return (
    <React.Fragment>
      <div className="row" style={{ margin: '20px' }}>
        <div
          className="col-md-3"
          style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
        >
          <span style={{ fontSize: 18, color: '#000000' }}>
            <b>{label}</b>
          </span>
        </div>
        <div className="col-md-9">
          <input
            onChange={e => handleIdChange(e, onChangeFunc)}
            type="text"
            className="form-control"
            placeholder=""
            aria-label=""
            aria-describedby="basic-addon1"
          />
        </div>
      </div>
    </React.Fragment>
  )
}

function handleIdChange(
  e: React.FormEvent<HTMLInputElement>,
  onChangeFunc: (value: string) => void
) {
  onChangeFunc(e.currentTarget.value)
}

export default LabelInputBar
