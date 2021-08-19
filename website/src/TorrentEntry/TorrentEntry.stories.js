import TorrentEntryComponent from './TorrentEntry'
import TabooMock from '../TabooMock.js'

export default {
  component: TorrentEntryComponent,
  title: 'TorrentEntry'
}

const taboo = new TabooMock()
const Template = (props) => <TorrentEntryComponent {...props} />
export const TorrentEntry = Template.bind({})

TorrentEntry.args = taboo.mockTorrent()
