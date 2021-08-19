const chance = require('chance')()
const EventEmitter = require('events')
const { List } = require('immutable')

class Taboo extends EventEmitter {
  constructor (...opts) {
    super(...opts)
    // A map of infoHash -> { name, files }
    this.TorrentTable = new Map()
  }

  addTorrent () {
    const t = this.mockTorrent()
    this.TorrentTable.set(t.infoHash, t)
    this.emit('torrent', t)
  }

  mockTorrent () {
    const infoHash = chance.hash({ length: 41 })
    const name = chance.sentence()
    const arrayLength = chance.integer({
      min: 1,
      max: 30
    })
    let files = new Array(arrayLength).fill(0)
    files = files.map(() => {
      const path = chance.sentence().replace(/ /g, '/')
      const suffix = chance.word()
      return path + suffix
    })
    return { name, files, infoHash }
  }

  mockArray () {
    const count = chance.integer({ min: 10, max: 20 })
    const result = new Array(count)
    return List(result
      .fill(0)
      .map(this.mockTorrent))
  }

  torrents () {
    return this.TorrentTable.values()
  }
}

export default Taboo
