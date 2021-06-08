const axios = require('axios')
const { ENV } = require('../configs/config')
let DOMAIN = 'dev.mnews.tw'

if (ENV === 'prod') {
  DOMAIN = 'statics.mnews.tw'
} else if (ENV === 'stag') {
  DOMAIN = 'www-stag.mnews.tw'
}

module.exports = async function getHeaderData(req, res) {
  try {
    const apiUrl = `https://${DOMAIN}/json${req.url}.json`
    const response = await axios.get(apiUrl)
    res.send(response.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
