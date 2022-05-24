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
    this.Timeouts = 0
    this.Lookup = 0
    this.Dropped = 0

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
    for (let i = 0; i < 100000; i++) {
      const dht = new DHT()
      dht.on('peer', (_, infoHash) => {
        this._onInfoHash(dht, infoHash)
      })
      dht.on('get_peers', (infoHash) => {
        this._onInfoHash(dht, infoHash)
      })
      dht.on('announce_peer', (infoHash) => {
        this._onInfoHash(dht, infoHash)
      })
      dht.on('announce', (_, infoHash) => {
        this._onInfoHash(dht, infoHash)
      })
      DHTs.push(dht)
    }

    setInterval(() => {
      process.stdout.write('\x1b8');
      process.stdout.write(`Looking up: \x1b[1m\x1b[33m${this.Lookup}\x1b[0m `)
      process.stdout.write(`Resolving: \x1b[1m\x1b[33m${this.TorrentClient.torrents.length}\x1b[0m `)
      process.stdout.write(`Resolved: \x1b[1m\x1b[33m${this.TorrentTable.size}\x1b[0m `)
      process.stdout.write(`Dropped: \x1b[1m\x1b[33m${this.Dropped}\x1b[0m `)
      process.stdout.write(`Timeouts: \x1b[1m\x1b[33m${this.Timeouts}\x1b[0m `)
      process.stdout.write(`Download Speed: \x1b[1m\x1b[33m${this.TorrentClient.downloadSpeed}\x1b[0m B `)
    }, 1000)
    process.stdout.write('\x1b7');
  }

  _onInfoHash (dht, ih) {
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

    this.Lookup += 1

    dht.get(ih, (err, res) => {
      this.Lookup -= 1
      if (err || !res) {
        this.Dropped += 1
        return
      }
      this._download(ih)
    })

  }

  _download(ih) {
    this.TorrentClient.add(hash, this.torrentOpts)
    setTimeout(() => {
      if(this.TorrentTable.has(hash)) {
        return
      }
      this.TorrentClient.remove(hash)
    }, 5 * 60 * 1000);
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

    this.HashesProcessing -= 1
    this._queue()
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
