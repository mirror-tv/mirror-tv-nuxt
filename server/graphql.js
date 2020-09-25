const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const axios = require('axios')
const { GRAPHQL_ENDPOINT } = require('../configs/config')

router.use(bodyParser.json())

router.post('/', async function (req, res, next) {
  try {
    const response = await axios.post(GRAPHQL_ENDPOINT, req.body)
    res.send(response.data)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

module.exports = router
