import React from 'react'
import './Page.css'
import coffee from './coffee.svg'
import Navbar from '../Navbar/Navbar.js'
import TorrentList from '../TorrentList/TorrentList.js'
import FileList from '../FileList/FileList.js'
import Loading from '../Loading/Loading.js'

export default class Page extends React.PureComponent {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { torrents } = this.props
    const { selected } = this.state
    const event = (selected) => this.setState({ selected })
    return (
      <div className='Page'>
        <Navbar />
        <div className='Page_Coffee'>
          <img alt='coffee' className='Page_CoffeeIcon' src={coffee} />
          <div className='Page_CoffeeText'>
            Results will show here, but take time. Taboo is best left running for many hours (or days) at a time. So go grab coffee and come back later!
          </div>
        </div>
        {torrents.size > 0
          ? <div className='Page_Torrents'>
            <div className='Page_TorrentList'>
              <TorrentList torrents={torrents} onClick={event} />
            </div>
            {selected && <div className='Page_FileList'><FileList {...selected} /></div>}
          </div>
          : <div className='Page_Loading'>
            <Loading />
            <div className='Page_LoadingText'>Scuttling the DHT</div>
          </div>}
      </div>
    )
  }
}
