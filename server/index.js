const fastify = require('fastify')()
const ws = require('fastify-websocket')

const Taboo = require('../lib')
const taboo = new Taboo()

fastify.register(ws)

fastify.get('/torrents', { websocket: true }, (conn) => {
  const torrents = taboo.torrents()
  for (const torrent of torrents) {
    console.log(torrent)
    conn.socket.send(JSON.stringify(torrent))
  }
  taboo.on('torrent', (torrent) => {
    console.log(torrent)
    conn.socket.send(JSON.stringify(torrent))
  })
})

fastify.listen(3000, (e, address) => {
  console.log(`Server listening on ${address}`)
})
