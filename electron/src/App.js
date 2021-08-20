/* global WebSocket */
import React from 'react'
import Page from './TabooUI/Page/Page.js'
import { List } from 'immutable'
import './App.css'
const Taboo = window.require('TabooLib')
let taboo

// Give the UI time to bootstrap before doing
// CPU intensive work
setTimeout(() => {
    taboo = new Taboo()
}, 1000)

class App extends React.PureComponent {
  constructor () {
    super()
    this._checkReady = setInterval(this.checkReady.bind(this))
    this.state = {
        torrents: List([])
    }
  }

  checkReady() {
      // Once taboo is set, bootstrap the UI with all torrents
      if(taboo) {
          clearInterval(this._checkReady)
          this.setState((state) => {
              for(torrent of taboo.torrents()) {
                  state.torrents = state.torrents.push(torrent)
              }
              taboo.on('torrent', this.onTorrent.bind(this))
          })
      }
  }

  onTorrent (torrent) {
    // We use immutable.js to prevent unnecessary
    // rendering. On every new torrent, append that
    // to our existing list of torrents.
    this.setState((state) => ({
      torrents: this.state.torrents.push(torrent)
    }))
  }

  render () {
    return <Page torrents={this.state.torrents} />
  }
}

export default App
