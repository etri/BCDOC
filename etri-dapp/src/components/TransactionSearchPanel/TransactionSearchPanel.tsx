import * as React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import { Transaction } from 'src/types'
import { connect } from 'react-redux'
import { RootState } from '../../types/index'
import TransactionItem from '../BlockSearchPanel/TransactionItem'
import DropDown, { DropDowmItem } from '../Dropdown/Dropdown'
import * as actions from '../../actions'

export interface Props {
  transaction: Transaction
  errorMsg: string
  findTransactionByID(transactionID: string, channel: string): void
}

export interface State {
  channel: string
}

const DropdownItems = [
  {
    label: 'tokench'
  },
  {
    label: 'evaluationch'
  }
] as DropDowmItem[]

class TransactionSearchPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      channel: DropdownItems[0].label
    }

    this.onSelectItem = this.onSelectItem.bind(this)
    this.findTransactionByID = this.findTransactionByID.bind(this)
  }

  private onSelectItem(label: string) {
    this.setState({ channel: label })
  }

  private findTransactionByID(transactionID: string) {
    this.props.findTransactionByID(transactionID, this.state.channel)
  }

  public componentDidMount() {
    // @ts-ignore
    const modalBackdrop = document.getElementsByClassName('modal-backdrop')

    // @ts-ignore
    if (modalBackdrop && modalBackdrop[0]) {
      // @ts-ignore
      modalBackdrop[0].remove()
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="offset-md-1 col-md-10 row" style={{ padding: '20px' }}>
          <div className="col-md-11">
            <SearchBar search={this.findTransactionByID} />
          </div>
          <div className="col-md-1">
            <DropDown dropDownItems={DropdownItems} onSelectItem={this.onSelectItem} />
          </div>
        </div>
        {this.props.errorMsg == '' ? (
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Transaction Body</h5>
              {this.props.transaction ? (
                <TransactionItem transaction={this.props.transaction.transactionEnvelope} />
              ) : (
                <span>No Transaction..</span>
              )}
            </div>
          </div>
        ) : (
          <span className="label label-danger">{this.props.errorMsg}</span>
        )}
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ TransactionStoreState }: RootState) {
  return {
    transaction: TransactionStoreState.transaction,
    errorMsg: TransactionStoreState.errorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    findTransactionByID: (transactionID: string, channel: string) =>
      dispatch(actions.getTransactionByID(transactionID, channel))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionSearchPanel)
