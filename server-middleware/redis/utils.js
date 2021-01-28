/* eslint-disable no-console */
// Doc: https://github.com/luin/ioredis
const Redis = require('ioredis')

const {
  ENV,
  REDIS_AUTH,
  REDIS_PORT,
  REDIS_HOST,
} = require('../../configs/config')

const PREFIX = `${process.env.npm_package_name}_${ENV}:`

const ENABLE_REDIS = ENV === 'prod'

let redisClient

if (REDIS_HOST && REDIS_PORT && REDIS_AUTH) {
  if (ENV === 'dev') {
    redisClient = new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_AUTH,
    })
    redisClient.on('error', (err) => {
      console.error(`[REDIS] ${err.message}`, err)
    })
  }
} else {
  console.error('[REDIS] Missing config.')
}

function cleanPathQuery(url) {
  return url.replace(/\?.*/gs, '')
}

module.exports = {
  ENABLE_REDIS,
  PREFIX,
  cleanPathQuery,
  redisClient,
}
