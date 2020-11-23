const sendGaEvent = ($ga) => (eventCategory) => (eventAction) => (eventLabel) =>
  $ga.event({
    eventCategory,
    eventAction,
    eventLabel,
  })

export { sendGaEvent }
