const axios = require('axios')

module.exports = async function getHeaderData(req, res) {
  try {
    const apiUrl = `https://storage.googleapis.com/static-mnews-tw-dev/json${req.url}`
    const response = await axios.get(apiUrl)
    res.send(response.data)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err)
  }
}
