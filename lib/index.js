const DHT = require('bittorrent-dht')
const WebTorrent = require('webtorrent')
const MemoryChunkStore = require('memory-chunk-store')
const EventEmitter = require('events')

class Indexer extends EventEmitter {
  constructor (...opts) {
    super(...opts)

    // Used to dedupe hashes, so we don't process
    // them more than once
    this.DiscoveryTable = new Map()

    // A map of infoHash -> { name, files }
    this.TorrentTable = new Map()

    // An instance of WebTorrent that we'll use to
    // resolve metadata
    this.TorrentClient = new WebTorrent()
    const onTorrent = this._onTorrent.bind(this)
    this.TorrentClient.on('torrent', onTorrent)

    this.TorrentOpts = {
      // Free memory after resolving metadata
      destroyStoreOnDestroy: true,
      // Use memory chunk store to avoid polluting
      // disk with temporary data
      store: MemoryChunkStore
    }

    // Spin up a bunch of DHT nodes. We need more than
    // to increase our chances of seeing interesting
    // content, since our view of the DHT's content is
    // a function of our NodeID.
    const DHTs = this.DHTs = []
    const onInfoHash = this._onInfoHash.bind(this)
    for (let i = 0; i < 30000; i++) {
      const dht = new DHT()
      dht.on('announce', onInfoHash)
      dht.on('peer', onInfoHash)
      DHTs.push(dht)
    }
  }

  _onInfoHash (_, ih) {
    // bt gives us a buffer, but we want to use a
    // string representation for our Map and for
    // readability
    const infoHash = ih.toString('hex')

    // First check to see if we've seen this
    // hash before
    if (this.DiscoveryTable.get(infoHash)) {
      // If so, we don't have any work to
      // do so return early
      return
    }

    // Dedupe future encounters with this hash
    this.DiscoveryTable.set(infoHash, true)

    // Get to work resolving the infoHash
    this.TorrentClient.add(ih, this.torrentOpts)
  }

  _onTorrent (torrent) {
    // Once we have the torrent, store the file list
    // and remove the torrent from memory
    const infoHash = torrent.infoHash
    const name = torrent.name
    const files = torrent.files.map(v => v.path)
    const t = { name, files, infoHash }
    // We are done processing the Torrent so let the
    // client free resources
    torrent.destroy()

    // Store the results
    this.TorrentTable.set(infoHash, t)

    // Emit the torrent event
    this.emit('torrent', t)
  }

  // Make it easy to bootstrap state from this class by
  // exposing an iterable set of all torrents.
  // Note: probably shouldn't break the event loop between
  // subscribing to the torrent event and processing this
  // list!
  torrents (key) {
    return this.TorrentTable.values()
  }
}
module.exports = Indexer
