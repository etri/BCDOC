import * as React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'

export interface Props {
  search?: (searchWord: string) => void
}

export interface State {
  searchWord: string
}

class SearchBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchWord: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-md-center">
          <div className="form-group col-md-8">
            <div className="input-group input-group-md">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon="search" />
                </span>
              </div>
              <input
                onChange={this.handleChange}
                value={this.state.searchWord}
                type="text"
                className="form-control"
                onKeyPress={event => this.Search(event.key)}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }

  private handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({ searchWord: e.currentTarget.value })
  }

  private Search(key: string) {
    if (key === 'Enter') {
      if (this.props.search) {
        this.props.search(this.state.searchWord)
      }
    }
  }
}

function mapStateToProps({}) {
  return {}
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar)

// export default SearchBar
