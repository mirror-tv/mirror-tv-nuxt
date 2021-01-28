/* eslint-disable no-console */
const { ENABLE_REDIS, PREFIX, cleanPathQuery, redisClient } = require('./utils')

const SKIP_REDIS_LIST = ['/api/tracking']

module.exports = function (req, res, next) {
  if (SKIP_REDIS_LIST.includes(req.url)) {
    return next()
  }

  if (ENABLE_REDIS && redisClient) {
    const path = cleanPathQuery(req.url)
    const key = `${PREFIX}${path}`

    redisClient
      .get(key)
      .then((result) => {
        if (result) {
          res.setHeader('source', 'redis')
          return res.send(JSON.parse(result))
        }
        return next()
      })
      .catch((err) => {
        console.error(`[REDIS/READ]Get Redis Failed. key: ${key}`, err)
        return next()
      })
  } else {
    return next()
  }
}
