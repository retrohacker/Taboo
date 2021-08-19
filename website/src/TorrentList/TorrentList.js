import React from 'react'
import './TorrentList.css'
import TorrentEntry from '../TorrentEntry/TorrentEntry.js'

function TorrentListEntry (torrent, self) {
  const { infoHash } = torrent
  const event = self._clicked.bind(self, torrent)
  return (
    <div key={infoHash} className='TorrentList_Entry' onClick={event}>
      <TorrentEntry {...torrent} />
    </div>
  )
}

export default class TorrentList extends React.PureComponent {
  constructor (...args) {
    super(...args)
    this._handlers = []
  }

  _clicked (torrent) {
    this._handlers.forEach(v => v(torrent))
  }

  render () {
    const { torrents, onClick } = this.props
    if (onClick) {
      this._handlers.push(onClick)
    }
    return (
      <div className='TorrentList'>
        {torrents.map(v => TorrentListEntry(v, this))}
      </div>
    )
  }
}
