const axios = require('axios')

module.exports = async function getPopularData(req, res) {
  try {
    // https://storage.googleapis.com/static-mnews-tw-dev/json/popularlist.json
    const apiUrl = `https://storage.googleapis.com/static-mnews-tw-dev/json${req.url}`
    const response = await axios.get(apiUrl)
    res.send(response.data)
  } catch (err) {
    console.log(err)
  }
}
