/* eslint-disable no-console */
const {
  ENABLE_REDIS,
  PREFIX,
  cleanPathQuery,
  redisReadClient,
} = require('./utils')

module.exports = function (req, res, next) {
  if (ENABLE_REDIS && redisReadClient) {
    const path = cleanPathQuery(req.url)
    const key = `${PREFIX}${path}`

    redisReadClient
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
