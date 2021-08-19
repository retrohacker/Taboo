const fastify = require('fastify')()
const ws = require('fastify-websocket')
const fastifyStatic = require('fastify-static')
const path = require('path')
const Taboo = require('../lib')
let taboo

console.log('Starting local server...')
fastify.register(ws)

const staticRoot = path.join(__dirname, '..', 'website', 'build')
fastify.register(fastifyStatic, { root: staticRoot })

fastify.get('/torrents', { websocket: true }, (conn) => {
  if (!taboo) {
    return
  }
  const torrents = taboo.torrents()
  for (const torrent of torrents) {
    conn.socket.send(JSON.stringify(torrent))
  }
  taboo.on('torrent', (torrent) => {
    conn.socket.send(JSON.stringify(torrent))
  })
})

fastify.listen(3000, (e, address) => {
  if (e) {
    throw e
  }
  console.log(`Server listening on ${address}`)
  console.log('Bootstrapping DHT...')
  taboo = new Taboo()
})
