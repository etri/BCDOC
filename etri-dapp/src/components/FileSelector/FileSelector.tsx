import * as React from 'react'

interface State {
  selectorFile: File | null
}

interface Props {
  onFileChange(selectorFiles: File): void
}

class FileSelector extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectorFile: null
    }

    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(selectorFiles: FileList | null) {
    if (selectorFiles) {
      this.props.onFileChange(selectorFiles[0])
      this.setState({ selectorFile: selectorFiles[0] })
    }
  }

  render() {
    return (
      <div className="custom-file">
        <input
          type="file"
          className="custom-file-input"
          id="validatedCustomFile"
          onChange={e => this.handleChange(e.target.files)}
        />
        {this.state.selectorFile ? (
          <label className="custom-file-label">{this.state.selectorFile.name}</label>
        ) : (
          <label className="custom-file-label">Choose file...</label>
        )}
      </div>
    )
  }
}

export default FileSelector
