const axios = require('axios')

const {
  YOUTUBE_API_PROTOCOL = 'https',
  YOUTUBE_API_HOST,
  YOUTUBE_API_TIMEOUT,
} = require('../configs/config.js')

module.exports = async function getYoutubeData(req, res) {
  try {
    const apiUrl = `${YOUTUBE_API_PROTOCOL}://${YOUTUBE_API_HOST}${req.url}`
    const { data = {} } = await axios.get(apiUrl, {
      timeout: YOUTUBE_API_TIMEOUT,
    })
    res.send(data)
  } catch (err) {
    const status = err?.response?.status ?? 500
    res.setHeader('Cache-Control', 'no-store')
    res.status(status).send(err.message)
  }
}
