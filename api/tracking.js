const { isEmpty } = require('lodash')
const { Logging } = require('@google-cloud/logging')
const {
  GCP_KEYFILE_PATH,
  GCP_PROJECT_ID,
  GCP_STACKDRIVER_LOG_NAME,
} = require('../configs/config')

const logging = new Logging({
  projectId: GCP_PROJECT_ID,
  keyFilename: GCP_KEYFILE_PATH,
})

module.exports = function (req, res, next) {
  try {
    res.send({ msg: 'Received.' })
    const query = !isEmpty(req.body) ? req.body : req.query
    const log = logging.log(GCP_STACKDRIVER_LOG_NAME)
    const metadata = { resource: { type: 'global' } }
    const ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.ip
    query.ip = ip
    const entry = log.entry(metadata, query)
    log.write(entry)
  } catch (error) {
    res.status(500).send('Internal Server Error')
    // eslint-disable-next-line no-console
    console.error('[ERROR] Client info logging error occurred:', error)
  }
}
