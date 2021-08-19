import React from 'react'
import './TorrentEntry.css'
import download from './download.svg'
import parse from 'parse-torrent'

export default class TorrentEntry extends React.PureComponent {
  render () {
    const { infoHash, name } = this.props
    const magnet = parse.toMagnetURI({ infoHash })
    return (
      <div className='TorrentEntry'>
        <a href={magnet}>
          <img alt='download' src={download} className='TorrentEntry_Logo' />
        </a>
        <div className='TorrentEntry_Text'>
          <div className='TorrentEntry_Title'>{name}</div>
          <div className='TorrentEntry_Subtitle'>{infoHash}</div>
        </div>
      </div>
    )
  }
}
