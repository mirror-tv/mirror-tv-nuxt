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

async function fetchScheduleData() {
  const url = '/program_list.json'
  try {
    const res = await axios.get(`${baseUrl}/api/schedule${url}`)
    return res.data
  } catch (err) {
    throw new FetchError(url, err.message, err.code)
  }
}

async function fetchPopularListData() {
  const url = '/popularlist.json'
  try {
    const res = await axios.get(`${baseUrl}/api/popular${url}`)
    return res.data
  } catch (err) {
    throw new FetchError(url, err.message, err.code)
  }
}

async function fetchHeaderRawData() {
  const url = '/featured_categories_post.json'
  try {
    const res = await axios.get(`${baseUrl}/api/header${url}`)
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
  inject('fetchHeaderRawData', () => fetchHeaderRawData())
  inject('fetchScheduleData', () => fetchScheduleData())
  inject('fetchPopularListData', () => fetchPopularListData())
}
