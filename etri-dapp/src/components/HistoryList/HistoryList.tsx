import * as React from 'react'
import { connect } from 'react-redux'
import { History, RootState } from '../../types/index'
import HistoryItem from './HistoryItem'
import { getTransactionList } from '../../actions/transaction'
import Pagination from '../Pagination/Pagination'

export interface Props {
  transactionList: History[] | undefined
  initialize: () => void
  fetch: (index: number) => void
}

export interface State {
  index: number
}

class HistoryList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      index: 0
    }

    this.props.initialize()
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
  }

  private next() {
    const newIndex = this.state.index + 10
    this.setState({ index: newIndex })
    this.props.fetch(newIndex)
  }

  private previous() {
    const newIndex = this.state.index - 10
    this.setState({ index: newIndex })
    this.props.fetch(newIndex)
  }

  render() {
    if (!this.props.transactionList) return null
    if (!this.props.transactionList.length) return <p>No historys</p>

    return (
      <React.Fragment>
        <div style={{ paddingTop: '50px' }}>
          <ul className="list-group">
            {this.props.transactionList.map(function(history, idx) {
              return <HistoryItem key={idx} history={history} />
            })}
          </ul>
          <Pagination
            next={this.next}
            index={this.state.index}
            previous={this.previous}
            length={this.props.transactionList.length}
          />
        </div>
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ TransactionStoreState }: RootState) {
  return {
    transactionList: TransactionStoreState.transactionList
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    initialize: () => dispatch(getTransactionList(0, 10)),
    fetch: (index: number) => dispatch(getTransactionList(index, index + 10))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryList)
