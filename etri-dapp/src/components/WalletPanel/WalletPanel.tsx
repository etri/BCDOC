import * as React from 'react'
import './WalletPanel.css'
import TransferPanel from './TransferPanel'
import Button from '../Button/Button'
import QueryPanel from './QueryPanel'
import { RootState, UserTokenInfo } from '../../types/index'
import { connect } from 'react-redux'

const enum tab {
  Transfer = 'Transfer',
  Query = 'Query'
}

const clickedColor = '#3C4E56'

export interface State {
  currentTab: tab
}

export interface Props {
  tokenInfo: UserTokenInfo
  index: number
  next: () => void
  previous: () => void
}

class WalletPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentTab: tab.Query
    }

    this.openTransferTab = this.openTransferTab.bind(this)
    this.openQueryTab = this.openQueryTab.bind(this)
  }

  private openTransferTab() {
    this.setState({ currentTab: tab.Transfer })
  }

  private openQueryTab() {
    this.setState({ currentTab: tab.Query })
  }

  componentDidMount() {
    // console.log("query token")
  }

  render() {
    return (
      <React.Fragment>
        <div style={style.container}>
          <div style={style.jumbotron}>
            <div className="row" style={{ height: '70px' }}>
              <div className="col">
                <span className="align-middle">
                  <b>{this.props.tokenInfo.name}</b>
                </span>
              </div>
            </div>
            <div className="row" style={{ height: '70px' }}>
              <div className="col">
                <span className="align-middle">
                  <b>ETX {this.props.tokenInfo.balance ? this.props.tokenInfo.balance : 0}</b>
                </span>
              </div>
            </div>
            <div style={style.tab}>
              <div className="row offset-md-4 col-md-4 justify-content-center">
                <Button
                  onClick={this.openQueryTab}
                  text="조회"
                  fontSize={22}
                  width={60}
                  marginColor={this.state.currentTab == tab.Query ? clickedColor : '#789BAD'}
                  color={this.state.currentTab == tab.Query ? clickedColor : '#789BAD'}
                />
                <Button
                  onClick={this.openTransferTab}
                  text="송금"
                  fontSize={22}
                  width={60}
                  marginColor={this.state.currentTab == tab.Transfer ? clickedColor : '#789BAD'}
                  color={this.state.currentTab == tab.Transfer ? clickedColor : '#789BAD'}
                />
              </div>
            </div>
            {this.state.currentTab == tab.Query ? (
              <QueryPanel
                history={this.props.tokenInfo.history}
                index={this.props.index}
                next={this.props.next}
                previous={this.props.previous}
              />
            ) : (
              <TransferPanel />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const style = {
  container: {
    paddingTop: '10px',
    paddingLeft: '50px',
    paddingRight: '50px'
  },
  jumbotron: {
    height: '210px',
    backgroundColor: '#3C4E56',
    color: '#ffffff',
    borderRadius: 10,
    fontSize: '25px'
  },
  info: {
    display: 'table',
    verticalAlign: 'middle'
  },
  tab: {
    height: '70px',
    backgroundColor: '#789BAD',
    borderRadius: 10
  }
}

// Wiring up with stores and actions
function mapStateToProps({ TokenStoreState }: RootState) {
  return {}
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletPanel)
