import * as React from 'react'
import SearchBar from '../SearchBar/SearchBar'
import BlockSearchPanelHeader from './BlockSearchPanelHeader'
import TransactionList from './TransactionList'
import { Block } from 'src/types'
import { connect } from 'react-redux'
import { RootState } from '../../types/index'
import DropDown from '../Dropdown/Dropdown'
import { DropDowmItem } from '../Dropdown/Dropdown'
import * as actions from '../../actions'

export interface Props {
  block: Block
  getBlockByHeight(height: number, channel: string): void
  getLastBlock(channel: string): void
  errorMsg: string
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

class BlockSearchPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      channel: DropdownItems[0].label
    }

    this.onSelectItem = this.onSelectItem.bind(this)
    this.findBlockByHeight = this.findBlockByHeight.bind(this)
    this.findLastBlock = this.findLastBlock.bind(this)
  }

  public componentDidMount() {
    this.props.getLastBlock(this.state.channel)
  }

  private onSelectItem(label: string) {
    this.setState({ channel: label })
    this.props.getLastBlock(label)
  }

  private findBlockByHeight(height: string) {
    this.props.getBlockByHeight(Number(height), this.state.channel)
  }

  private findLastBlock() {
    this.props.getLastBlock(this.state.channel)
  }

  render() {
    return (
      <React.Fragment>
        <div className="offset-md-1 col-md-10 row" style={{ padding: '20px' }}>
          <div className="col-md-1">
            <button type="button" className="btn btn-primary" onClick={this.findLastBlock}>
              Last Block
            </button>
          </div>
          <div className="col-md-10">
            <SearchBar search={this.findBlockByHeight} />
          </div>
          <div className="col-md-1">
            <DropDown dropDownItems={DropdownItems} onSelectItem={this.onSelectItem} />
          </div>
        </div>
        {this.props.errorMsg == '' ? (
          <div className="card text-center">
            <div className="card-header">
              <h5 className="card-title">Block Header</h5>
              {this.props.block && this.props.block.header ? (
                <BlockSearchPanelHeader
                  blockHeight={this.props.block.header.number}
                  prevHash={this.props.block.header.previous_hash}
                  currentHash={this.props.block.header.data_hash}
                />
              ) : (
                <span>No Block Header..</span>
              )}
            </div>
            <div className="card-body">
              <h5 className="card-title">Block Body</h5>
              {this.props.block && this.props.block.data ? (
                <TransactionList transactionList={this.props.block.data.data} />
              ) : (
                <span>No block Body..</span>
              )}
            </div>
          </div>
        ) : (
          <span> {this.props.errorMsg} </span>
        )}
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ BlockStoreState }: RootState) {
  return {
    block: BlockStoreState.block,
    errorMsg: BlockStoreState.errorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    getBlockByHeight: (height: number, channel: string) =>
      dispatch(actions.getBlockByHeight(height, channel)),
    getLastBlock: (channel: string) => dispatch(actions.getLastBlock(channel))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BlockSearchPanel)
