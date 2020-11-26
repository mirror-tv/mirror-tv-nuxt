/* eslint-disable no-console */
// Doc: https://github.com/luin/ioredis
const Redis = require('ioredis')

const {
  ENV,
  REDIS_AUTH,
  REDIS_PORT,
  REDIS_READ_HOST,
  REDIS_WRITE_HOST,
} = require('../../configs/config')

const PREFIX = `${process.env.npm_package_name}_${ENV}:`

const ENABLE_REDIS = ENV === 'prod'

let redisReadClient, redisWriteClient

if (REDIS_PORT && REDIS_AUTH) {
  if (REDIS_READ_HOST) {
    redisReadClient = new Redis({
      port: REDIS_PORT,
      host: REDIS_READ_HOST,
      password: REDIS_AUTH,
    })
    redisReadClient.on('error', (err) => {
      console.error(`[REDIS/READ] ${err.message}`, err)
    })
  } else {
    console.error('[REDIS/READ] Missing config.')
  }
  if (REDIS_WRITE_HOST) {
    redisWriteClient = new Redis({
      port: REDIS_PORT,
      host: REDIS_WRITE_HOST,
      password: REDIS_AUTH,
    })
    redisWriteClient.on('error', (err) => {
      console.error(`[REDIS/WRITE] ${err.message}`, err)
    })
  } else {
    console.error('[REDIS/WRITE] Missing config.')
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
  redisReadClient,
  redisWriteClient,
}
