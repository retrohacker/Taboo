import FileListComponent from './FileList'
import TabooMock from '../TabooMock.js'

export default {
  component: FileListComponent,
  title: 'FileList'
}

const Template = (props) => <FileListComponent {...props} />

export const FileList = Template.bind({})
const taboo = new TabooMock()
FileList.args = taboo.mockTorrent()
