import axios from 'axios'

const baseUrl = process.browser ? `//${location.host}` : 'http://localhost:3000'

async function fetchYoutubeData(url) {
  try {
    const res = await axios.get(`${baseUrl}/api/youtube${url}`)
    return res.data
  } catch (err) {
    throw new FetchError(url, err.message, err.code)
  }
}

async function fetchGcsData(url) {
  try {
    const res = await axios.get(`${baseUrl}/api/gcs${url}`)
    return res.data
  } catch (err) {
    throw new FetchError(url, err.message, err.code)
  }
}

class FetchError extends Error {
  constructor(url, message = 'Not Found', code = 404) {
    const errorMessage = `${message}, url: ${url}`
    super(errorMessage)
    this.name = this.constructor.name
    this.code = code
  }
}

export default (context, inject) => {
  inject('fetchYoutubeData', (url) => fetchYoutubeData(url))
  inject('fetchGcsData', (url) => fetchGcsData(url))
}
