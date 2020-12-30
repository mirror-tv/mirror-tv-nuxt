import { createUserBehaviorLog, getClickableTarget } from './utils'

// const debug = require('debug')('user-behavior-log')

export default ({ app }) => {
  // pageview event
  app.router.afterEach(async (to, from) => {
    const isSearchPage = to.name === 'search'
    const log = await createUserBehaviorLog({
      eventType: 'pageview',
      ...(isSearchPage ? { keyword: createSearchKeywordValue() } : {}),
    })
    sendLog(log)

    function createSearchKeywordValue() {
      return to?.params?.keyword?.split(',')
    }
  })

  // click event
  window.addEventListener('click', async (event) => {
    const target = getClickableTarget(event?.target)
    if (target) {
      const log = await createUserBehaviorLog({
        eventType: 'click',
        target: getClickableTarget(event?.target),
      })
      sendLog(log)
    }
  })

  // exit event
  window.addEventListener('beforeunload', async (event) => {
    const log = await createUserBehaviorLog({ eventType: 'exit' })
    sendLog(log)
  })
}

function sendLog(log) {
  const blob = new Blob([JSON.stringify({ clientInfo: log })], {
    type: 'application/json; charset=UTF-8',
  })
  navigator?.sendBeacon('/api/tracking', blob)
}
