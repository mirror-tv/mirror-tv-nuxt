module.exports = function (req, res, next) {
  const hostname = req.hostname
  const url = req.url
  const isNoCaching =
    hostname.match(/dev.mnews.tw/gs) || url.match(/^\/api\/tracking$/gs)

  if (isNoCaching) {
    res.set('Cache-Control', 'no-store')
    return next()
  }

  if (url.match(/^\/(category)\//gs)) {
    res.set('cache-control', 'public, max-age=300')
  } else if (url.match(/^\/(story|show|ombuds|search|tag)\//gs)) {
    res.set('cache-control', 'public, max-age=600')
  } else if (url.match(/^\/(anchor|anchorperson)\//gs)) {
    res.set('cache-control', 'public, max-age=1800')
  } else if (url.match(/^\/$/gs)) {
    // home
    res.set('cache-control', 'public, max-age=300')
  }

  return next()
}
