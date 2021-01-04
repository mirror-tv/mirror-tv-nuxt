import { v4 as uuidv4 } from 'uuid'
import Bowser from 'bowser'
import Cookie from 'vue-cookie'
import localforage from 'localforage'

async function createUserBehaviorLog({
  eventType = 'not set',
  category = 'whole-site',
  target = null,
  ...rest
}) {
  const bowserResult = Bowser.parse(window.navigator?.userAgent)
  const now = Date.now()

  let clientIdStartTime = now

  await localforage
    .getItem('mmIdStartTime')
    .then((value) => {
      if (!value) {
        localforage.setItem('mmIdStartTime', now)
      } else {
        clientIdStartTime = value
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(
        'Failed to get the "m-tv-shouldOpenGdpr" item from storage by localForage',
        err
      )
    })
  const log = {
    browser: bowserResult.browser,
    category,
    client_id: Cookie.get('mmid') || setCookie('mmid', '10Y'),
    client_id_start_time: clientIdStartTime,
    client_os: bowserResult.os,
    datetime: now,
    eventType,
    location: window?.location?.href,
    redirect_to: target?.href,
    referrer: document?.referrer,
    session_id: Cookie.get('mmid-session') || setCookie('mmid-session', '30m'),
    screen_resolution: `${window?.screen?.width}x${window?.screen?.height}`,
    target_class_name: target?.className,
    target_id: target?.id,
    target_tag_name: target?.tagName,
    target_text_content: target?.textContent?.trim(),
    viewport_size: `${document?.documentElement?.clientWidth}x${document?.documentElement?.clientHeight}`,
    ...rest,
  }
  return log
}

function getClickableTarget(eventTaget) {
  let target = eventTaget
  while (target) {
    const tagName = target?.tagName
    if (tagName === 'A' || tagName === 'BUTTON') {
      break
    }
    target = target?.parentNode
  }
  return target
}

function setCookie(key, expires) {
  const uuid = uuidv4()
  Cookie.set(key, uuid, { expires })
  return uuid
}

export { createUserBehaviorLog, getClickableTarget }
