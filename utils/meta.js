import { ENV } from '../configs/config'

function getDomain() {
  if (process.server) {
    if (ENV === 'prod') {
      return `https://www.mnews.tw`
    }
    if (ENV === 'dev') {
      return `http://dev.mnews.tw`
    }
    return `http://localhost:3000`
  }
  return `${location?.origin}`
}

export { getDomain }
