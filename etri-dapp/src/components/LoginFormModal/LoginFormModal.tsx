import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { RootState } from '../../types'

interface State {
  id: string
  orgName: string
  departmentName: string
  password: string
}

interface Props {
  onLogin: (id: string, orgName: string, departmentName: string, password: string) => void
  errorMsg: string
}

class LoginFormModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      id: '',
      password: '',
      departmentName: '',
      orgName: ''
    }

    this.login = this.login.bind(this)
  }

  render() {
    return (
      <div className="modal fade" id="LoginFormModal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Login
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {this.props.errorMsg ? (
                <div className="alert alert-danger" role="alert">
                  {this.props.errorMsg}
                </div>
              ) : (
                ''
              )}
              <div className="form-group">
                <input
                  onChange={e => this.onInputIdChange(e)}
                  value={this.state.id}
                  type="text"
                  placeholder="ID"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={e => this.onInputPasswordChange(e)}
                  value={this.state.password}
                  type="password"
                  placeholder="Password"
                  className="form-control form-control-lg"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="loginClose"
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                취소
              </button>
              <button type="button" className="btn btn-primary" onClick={this.login}>
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private login() {
    if (this.state.id != '' && this.state.password != '') {
      this.props.onLogin(
        this.state.id,
        this.state.orgName,
        this.state.departmentName,
        this.state.password
      )
    }

    this.setState({ id: '', password: '' })
  }

  private onInputIdChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ id: e.currentTarget.value })
  }

  private onInputPasswordChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ password: e.currentTarget.value })
  }
}

function mapStateToProps({ UserStoreState }: RootState) {
  return {
    errorMsg: UserStoreState.LoginErrorMsg
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onLogin: (id: string, orgName: string, departmentName: string, password: string) =>
      dispatch(actions.login(id, orgName, departmentName, password))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginFormModal)
