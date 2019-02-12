import * as React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../actions'
import { RootState } from 'src/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface State {
  orgName: string
  departmentName: string
  userID: string
  userName: string
  password: string
}

interface Props {
  register(
    id: string,
    userName: string,
    orgName: string,
    departmentName: string,
    password: string
  ): void
  errorMsg: string
  setErrorMsg(msg: string): void
  registerIsLoading: boolean
}

class RegisterFormModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      orgName: '',
      departmentName: '',
      userID: '',
      userName: '',
      password: ''
    }

    this.onUserIDChange = this.onUserIDChange.bind(this)
    this.onUserNameChange = this.onUserNameChange.bind(this)
    this.onOrgNameChange = this.onOrgNameChange.bind(this)
    this.onDepartmentNameChange = this.onDepartmentNameChange.bind(this)
    this.onInputPasswordChange = this.onInputPasswordChange.bind(this)
    this.register = this.register.bind(this)
  }

  private onUserIDChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ userID: e.currentTarget.value })
  }

  private onUserNameChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ userName: e.currentTarget.value })
  }

  private onOrgNameChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ orgName: e.currentTarget.value })
  }

  private onDepartmentNameChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ departmentName: e.currentTarget.value })
  }

  private onInputPasswordChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ password: e.currentTarget.value })
  }

  render() {
    return (
      <div className="modal fade" id="RegisterFormModal" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <ul className="list-inline" style={{ padding: '0px', margin: '0px' }}>
                <li className="list-inline-item">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Register
                  </h5>
                </li>
                {this.props.errorMsg != '' && (
                  <li className="list-inline-item">
                    <h6>
                      <span className="align-middle" style={{ color: 'red' }}>
                        {'* ' + this.props.errorMsg}
                      </span>
                    </h6>
                  </li>
                )}
              </ul>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <input
                  onChange={e => this.onUserIDChange(e)}
                  value={this.state.userID}
                  type="text"
                  placeholder="UserID"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={e => this.onUserNameChange(e)}
                  value={this.state.userName}
                  type="text"
                  placeholder="UserName"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={e => this.onOrgNameChange(e)}
                  value={this.state.orgName}
                  type="text"
                  placeholder="OrgName"
                  className="form-control form-control-lg"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={e => this.onDepartmentNameChange(e)}
                  value={this.state.departmentName}
                  type="text"
                  placeholder="DepartmentName"
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
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.register}
                disabled={this.props.registerIsLoading ? true : false}
              >
                {this.props.registerIsLoading ? (
                  <FontAwesomeIcon icon="spinner" className="fa-spin" size="xs" />
                ) : (
                  'Register'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private register() {
    const { userID, userName, orgName, departmentName, password } = this.state
    if (userID != '' && userName != '' && orgName != '' && departmentName != '' && password != '') {
      this.props.register(userID, userName, orgName, departmentName, password)

      this.setState({ orgName: '', departmentName: '', userID: '', userName: '', password: '' })
    } else {
      this.props.setErrorMsg('Error: Fill all input')
    }
  }
}

function mapStateToProps({ UserStoreState }: RootState) {
  return {
    errorMsg: UserStoreState.RegisterErrorMsg,
    registerIsLoading: UserStoreState.RegisterIsLoading
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    register: (
      id: string,
      userName: string,
      orgName: string,
      departmentName: string,
      password: string
    ) => dispatch(actions.register(id, userName, orgName, departmentName, password)),
    setErrorMsg: (msg: string) => dispatch(actions.setRegisterErrorMsg(msg))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterFormModal)
