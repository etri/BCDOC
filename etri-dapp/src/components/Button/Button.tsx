import * as React from 'react'

export interface Props {
  text: string
  height?: number
  width?: number
  marginColor?: string
  color?: string
  textColor?: string
  fontSize?: number
  className?: string
  onClick?: () => void
}

function Button({
  text,
  height = 50,
  width = 100,
  color = '#3A8EED',
  marginColor = 'transparent',
  textColor = '#ffffff',
  fontSize = 17,
  onClick,
  className
}: Props) {
  return (
    <React.Fragment>
      <div style={{ padding: '10px', backgroundColor: marginColor }}>
        <button
          type="button"
          className={'btn btn-primary' + className}
          style={{ width: width, height: height, backgroundColor: color, borderColor: color }}
          onClick={onClick}
        >
          <span style={{ color: textColor, fontSize: fontSize }}>
            <b>{text}</b>
          </span>
        </button>
      </div>
    </React.Fragment>
  )
}

export default Button
