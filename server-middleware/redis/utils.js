/* eslint-disable no-console */
// Doc: https://github.com/luin/ioredis
const Redis = require('ioredis')

const {
  ENV,
  REDIS_AUTH,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_TYPE,
} = require('../../configs/config')

const PREFIX = `${process.env.npm_package_name}_${ENV}:`

const ENABLE_REDIS = ENV === 'prod'

const MAX_RETRY_TIMES = 20

let redisClient

if (REDIS_HOST && REDIS_PORT && REDIS_AUTH) {
  if (REDIS_TYPE === 'cluster') {
    redisClient = new Redis.Cluster(
      [
        {
          port: REDIS_PORT,
          host: REDIS_HOST,
        },
      ],
      {
        redisOptions: {
          password: REDIS_AUTH,
        },
        clusterRetryStrategy: retryStrategy,
      }
    )
  } else {
    redisClient = new Redis({
      port: REDIS_PORT,
      host: REDIS_HOST,
      password: REDIS_AUTH,
      retryStrategy,
    })
  }
  if (redisClient) {
    redisClient.on('error', (err) => {
      console.error(`[REDIS] ${err.message}`, err)
    })
  }
} else {
  console.error('[REDIS] Missing config.')
}

function retryStrategy(times) {
  if (times > MAX_RETRY_TIMES) {
    return null
  }
  return 100
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
