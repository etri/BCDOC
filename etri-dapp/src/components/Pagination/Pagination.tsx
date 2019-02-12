import * as React from 'react'

export interface Props {
  next(): void
  previous(): void
  index: number
  length?: number
}

export interface State {}

class Pagination extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  private next() {
    this.props.next()
  }

  private previous() {
    this.props.previous()
  }

  render() {
    return (
      <React.Fragment>
        <div style={{ marginTop: '15px' }}>
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              <li className={'page-item ' + (this.props.index == 0 ? 'disabled' : '')}>
                <a className="page-link" href="#" onClick={this.previous}>
                  Previous
                </a>
              </li>
              <li
                className={
                  'page-item ' + (this.props.length && this.props.length < 10 ? 'disabled' : '')
                }
              >
                <a className="page-link" href="#" onClick={this.next}>
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </React.Fragment>
    )
  }
}

// // Wiring up with stores and actions
// function mapStateToProps({}: RootState) {
//   return {
//   }
// }

// function mapDispatchToProps(dispatch: any) {
//   return {
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(Pagination)

export default Pagination
