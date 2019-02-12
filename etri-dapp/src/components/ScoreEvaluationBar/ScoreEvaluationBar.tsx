import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface State {
  score: number
}

export interface Props {
  onChangeScore(score: number): void
  maxScore: number
  size?: string
  clickedColor?: string
  defaultColor?: string
}

class ScoreEvaluationBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      score: 1
    }

    this.onClick = this.onClick.bind(this)
    this.props.onChangeScore(this.state.score)
  }

  private onClick(index: number) {
    this.setState({ score: index + 1 })
    this.props.onChangeScore(index + 1)
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <ul className="list-inline padding-5">
            <li className="list-inline-item">
              <h3>
                <span className="align-middle">{this.state.score.toFixed(1)}</span>
              </h3>
            </li>
            <li className="list-inline-item">
              {Array.from(Array(this.props.maxScore), (e, i) => {
                let color = '#aeaeae'
                if (i + 1 <= this.state.score) {
                  color = '#3A8EED'
                }
                return (
                  <a key={i} className="fa-clickable" onClick={e => this.onClick(i)}>
                    <FontAwesomeIcon icon="star" size={'2x'} color={color} />
                  </a>
                )
              })}
            </li>
          </ul>
        </div>
      </React.Fragment>
    )
  }
}

export default ScoreEvaluationBar
