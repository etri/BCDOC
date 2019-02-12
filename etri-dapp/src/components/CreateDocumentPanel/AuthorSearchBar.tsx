import * as React from 'react'
import { Author } from '../../types/index'
import { userApi } from '../../api/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface Props {
  onAuthorChange(authorList: Author[]): void
  initialList: Author[]
}

export interface State {
  authorList: Author[]
  searchID: string
  isLoading: boolean
}

class AuthorSearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      authorList: this.props.initialList,
      searchID: '',
      isLoading: false
    }

    this.handleSearchIDChange = this.handleSearchIDChange.bind(this)
    this.searchAuthor = this.searchAuthor.bind(this)
    this.removeAuthor = this.removeAuthor.bind(this)
  }

  render() {
    return (
      <React.Fragment>
        <div className="row" style={{ margin: '20px' }}>
          <div
            className="col-md-3"
            style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
          >
            <span style={{ fontSize: 18 }}>
              <b>추가저자</b>
            </span>
          </div>
          <div className="col-md-9">
            <div className="row">
              <div className="col-md-10">
                <input
                  onChange={e => this.handleSearchIDChange(e)}
                  type="text"
                  className="form-control"
                  placeholder=""
                  aria-label=""
                  aria-describedby="basic-addon1"
                  value={this.state.searchID}
                />
              </div>
              <div className="col-md-2" style={{ padding: '0px' }}>
                <button type="button" className="btn btn-primary" onClick={this.searchAuthor}>
                  {this.state.isLoading ? (
                    <FontAwesomeIcon icon="spinner" className="fa-spin" size="xs" />
                  ) : (
                    '추가'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ margin: '20px' }}>
          {this.state.authorList && this.state.authorList.length > 0 && (
            <ul className="list-group" style={{ textAlign: 'right' }}>
              {this.state.authorList.map((author, i) => {
                return <li
                    className="list-group-item border-0"
                    key={i}
                    style={{ paddingTop: '0', paddingBottom: '0' }}
                  >
                    {`${author.name} (${author.id})`} [<a href='#' onClick={() => this.removeAuthor(i)}>x</a>]
                  </li>
              })}
            </ul>
          )}
        </div>
      </React.Fragment>
    )
  }

  private handleSearchIDChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ searchID: e.currentTarget.value })
  }

  private async searchAuthor() {
    this.setState({ isLoading: true })

    try {
      const userID = this.state.searchID
      const author: Author = await userApi.getAuthor(userID)
      this.setState(prevState => ({
        authorList: [...prevState.authorList, author]
      }))
    } catch (error) {
      // error 400 이면 id만 추가
      if (error.response && error.response.status && error.response.status == 400) {
        this.setState(prevState => ({
          authorList: [...prevState.authorList, { id: '', name: this.state.searchID } as Author]
        }))
      }
    }

    this.setState({ isLoading: false })
    this.setState({ searchID: '' })
    this.props.onAuthorChange(this.state.authorList)
  }

  private removeAuthor(index: number) {
    const authorList = JSON.parse(JSON.stringify(this.state.authorList))
    authorList.splice(index, 1)
    this.setState({ authorList })
  }
}

export default AuthorSearchBar
