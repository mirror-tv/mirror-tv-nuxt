const axios = require('axios')

const {
  YOUTUBE_API_PROTOCOL = 'https',
  YOUTUBE_API_HOST,
  YOUTUBE_API_TIMEOUT,
} = require('../configs/config.js')

const PLAYLIST_ID_WHICH_NEED_TTL = 'PLT6yxVwBEbi2dWegLu37V63_tP-nI6em_'

module.exports = async function getYoutubeData(req, res) {
  try {
    const apiUrl = `${YOUTUBE_API_PROTOCOL}://${YOUTUBE_API_HOST}${req.url}`
    const axiosConfig = {
      timeout: YOUTUBE_API_TIMEOUT,
    }

    const playlistId = req.query?.playlistId
    if (playlistId === PLAYLIST_ID_WHICH_NEED_TTL) {
      axiosConfig.headers = {
        'Cache-Set-TTL': 300,
      }
    }

    const response = await axios.get(apiUrl, axiosConfig)
    res.send(response.data)
  } catch (err) {
    const status = err?.response?.status ?? 500
    res.setHeader('Cache-Control', 'no-store')
    res.status(status).send(err.message)
  }
}
