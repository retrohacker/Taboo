import React from 'react'
import './FileList.css'

export default class FileList extends React.PureComponent {
  render () {
    let { files } = this.props
    files = files.join('\n')
    return <pre className='FileList_Files'>{files}</pre>
  }
}
