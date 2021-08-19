/* global WebSocket */
import React from 'react'
import Page from './Page/Page.js'
import './App.css'
import { List } from 'immutable'

class App extends React.PureComponent {
  constructor () {
    super()
    // Keep a list of torrents we've received over
    // the websocket connection, this is what will
    // be used to render the page.
    this.state = {
      torrents: List()
    }
  }

  componentDidMount () {
    // Determine where the websocket server is based
    // on where we loaded this page from.
    const { host, protocol } = window.location
    let url = 'ws://'
    if (protocol === 'https') {
      url = 'wss://'
    }
    url += `${host}/torrents`

    // Establish a websocket connection
    this._ws = new WebSocket(url)

    // The only messages the server sends are torrent
    // objects. Parse them as JSON and send them to
    // our torrent event handler.
    this._ws.onmessage = (event) => {
      console.log(this.state.torrents)
      try {
        const torrent = JSON.parse(event.data)
        this.onTorrent(torrent)
      } catch (e) {
        console.error(event, e)
      }
    }
  }

  componentWillUnmount () {
    // If this component is removed from the DOM,
    // destroy the websocket connection.
    this._ws.close()
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
