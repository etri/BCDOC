import * as React from 'react'
import BadgeList from '../BadgeList/BadgeList'
import DealItemList from './DealItemList'
import { TransactionType, RootState } from 'src/types'
import { Deal } from '../../types/index'
import Pagination from '../Pagination/Pagination'
import { connect } from 'react-redux'

const badges = [
  { type: TransactionType.CREATE_DOCUMENT },
  { type: TransactionType.EVALUATAION },
  { type: TransactionType.DEPOSIT },
  { type: TransactionType.WITHDRAW }
]

export interface Props {
  history: Deal[]
  index: number
  next: () => void
  previous: () => void
}

export interface State {}

class QueryPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <BadgeList badges={badges} />
        <DealItemList dealList={this.props.history} />
        <Pagination
          index={this.props.index}
          next={this.props.next}
          previous={this.props.previous}
          length={this.props.history.length}
        />
      </React.Fragment>
    )
  }
}

// Wiring up with stores and actions
function mapStateToProps({ NavItemStoreState, UserStoreState }: RootState) {
  return {
    selectedNavItem: NavItemStoreState.selectedNavItem,
    loggedIn: UserStoreState.User.loggedIn,
    id: UserStoreState.User.userID
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QueryPanel)
