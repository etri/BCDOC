import * as React from 'react'

export interface DropDowmItem {
  label: string
}

export interface Props {
  dropDownItems: DropDowmItem[]
  onSelectItem(label: string): void
}

export interface State {
  currentItem: string
}

class DropDown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      currentItem: this.props.dropDownItems[0].label
    }

    this.onItemChange = this.onItemChange.bind(this)
  }

  private onItemChange(label: string) {
    this.setState({ currentItem: label })
    this.props.onSelectItem(label)
  }

  render() {
    return (
      <React.Fragment>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-toggle="dropdown"
          >
            {this.state.currentItem}
          </button>
          <div className="dropdown-menu">
            {this.props.dropDownItems &&
              this.props.dropDownItems.map((item, i) => {
                return (
                  <a
                    key={i}
                    className="dropdown-item"
                    onClick={() => this.onItemChange(item.label)}
                  >
                    {item.label}
                  </a>
                )
              })}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DropDown
