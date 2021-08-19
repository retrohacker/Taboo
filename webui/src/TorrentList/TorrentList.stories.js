import TorrentListComponent from './TorrentList'
import TabooMock from '../TabooMock.js'

export default {
  component: TorrentListComponent,
  title: 'TorrentList'
}

const taboo = new TabooMock()
const Template = (props) => <TorrentListComponent {...props} />
export const TorrentList = Template.bind({})

TorrentList.args = {
  onClick: (torrent) => console.log(torrent),
  torrents: taboo.mockArray()
}
