const axios = require('axios')
const urlOrigin = getUrlOrigin()

function getUrlOrigin() {
  switch (process.env.RELEASE_TARGET) {
    case 'staging':
      return `https://staging.mnews.tw`
    case 'prod':
      return `https://statics.mnews.tw`
    default: {
      return `https://dev.mnews.tw`
    }
  }
}

module.exports = async function getHeaderData(req, res) {
  try {
    const apiUrl = `${urlOrigin}/json${req.url}.json`
    const response = await axios.get(apiUrl)
    res.send(response.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
