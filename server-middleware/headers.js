module.exports = function (req, res, next) {
  const hostname = req.hostname
  const url = req.url

  const isNoCaching = hostname.match(/dev.mnews.tw/gs)

  if (isNoCaching) {
    res.set('Cache-Control', 'no-store')
    return next()
  }

  if (url.match(/^\/(story|tag)\//gs)) {
    res.set('cache-control', 'public, max-age=900')
  } else if (url.match(/^\/(category|search)\//gs)) {
    res.set('cache-control', 'public, max-age=600')
  } else if (url.match(/^\/$/gs)) {
    res.set('cache-control', 'public, max-age=180')
  }

  return next()
}
