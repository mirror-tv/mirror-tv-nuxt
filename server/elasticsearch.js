const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const { Client } = require('@elastic/elasticsearch')
const { ELASTICSEARCH_URL } = require('../configs/config')
const createElasticSearchRequestBody = require('./util/createElasticSearchRequestBody')

// 為了測試通過而保留，在 server/index.js 已設定
router.use(bodyParser.json())

router.get('/', async function (req, res, next) {
  const { query, from = 0, size = 12 } = req.body

  const client = new Client({ node: ELASTICSEARCH_URL })

  try {
    const result = await client.search({
      index: 'tv.posts',
      from,
      size,
      body: createElasticSearchRequestBody(query),
      sort: 'publishTime:desc',
    })
    res.send(result)
  } catch (e) {
    next(e)
  }
})

module.exports = router
