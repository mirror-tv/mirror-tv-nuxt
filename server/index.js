const express = require('express')
const consola = require('consola')
const requestIp = require('request-ip')
const { Nuxt, Builder } = require('nuxt')
const { createTerminus } = require('@godaddy/terminus')
const app = express()

const bodyParser = require('body-parser')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const { redisClient } = require('../server-middleware/redis/utils')

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  app.use(bodyParser.json())

  app.use('/api/graphql', require('./graphql'))
  app.use('/api/search', require('./elasticsearch'))

  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(requestIp.mw())

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })

  /**
   * Graceful shutdown
   * https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
   * https://github.com/godaddy/terminus
   */
  createTerminus(server, {
    signal: 'SIGINT',
    onSignal,
    onShutdown,
  })

  function onSignal() {
    // eslint-disable-next-line no-console
    console.info('server is starting cleanup')
    return redisClient.quit()
  }

  function onShutdown() {
    // eslint-disable-next-line no-console
    console.info('server is shutting down.')
  }
}
start()
