import * as React from 'react'
import Button from '../Button/Button'
import LabelInputBar from '../LabelInputBar/LabelInputBar'
import { RootState } from '../../types/index'
import * as actions from '../../actions'
import { connect } from 'react-redux'

export interface Props {
  id: string
  errorMsg: string
  transfer: (sourceUserID: string, targetUserID: string, amount: number, timestamp: number) => void
}

export interface State {
  amount: string
  to: string
}

class TransferPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      amount: '',
      to: ''
    }

    this.onAmountChange = this.onAmountChange.bind(this)
    this.onToChange = this.onToChange.bind(this)
    this.processTransfer = this.processTransfer.bind(this)
  }

  render() {
    return (
      <React.Fragment>
        <div className="offset-md-1 col-md-10" style={{ padding: '20px' }}>
          {this.props.errorMsg ? (
            <div className="alert alert-danger" role="alert">
              {this.props.errorMsg}
            </div>
          ) : (
            ''
          )}
          <LabelInputBar label="금액" onChangeFunc={this.onAmountChange} />
          <LabelInputBar label="대상" onChangeFunc={this.onToChange} />
          <div className="offset-md-3 col-md-6">
            <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button text="취소" color="#393939" />
              <Button text="송금" color="#3A8EED" onClick={this.processTransfer} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  private onAmountChange(amount: string) {
    this.setState({ amount: amount })
  }

  private onToChange(to: string) {
    this.setState({ to: to })
  }

  private processTransfer() {
    const amountNum = Number(this.state.amount)
    if (!Number.isInteger(amountNum)) {
      return
    }

    const date = new Date()
    this.props.transfer(this.props.id, this.state.to, amountNum, date.getTime())
  }
}

// Wiring up with stores and actions
function mapStateToProps({ UserStoreState, TokenStoreState }: RootState) {
  return {
    id: UserStoreState.User.userID,
    errorMsg: TokenStoreState.errorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    transfer: (sourceUserID: string, targetUserID: string, amount: number, timestamp: number) =>
      dispatch(actions.transfer(sourceUserID, targetUserID, amount, timestamp))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransferPanel)
