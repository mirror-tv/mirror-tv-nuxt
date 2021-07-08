import { ENV } from '~/constants/env-variables'

function getDomain() {
  switch (ENV) {
    case 'dev':
      return `https://dev.mnews.tw`
    case 'staging':
      return `https://staging.mnews.tw`
    case 'prod':
      return `https://www.mnews.tw`
    default: {
      if (typeof window !== 'undefined') {
        return `${window.location?.origin}`
      }
      return `http://localhost:3000`
    }
  }
}

export { getDomain }
