async function setIntersectionObserver({
  elements = [],
  threshold = 1,
  handler,
}) {
  await import('intersection-observer').then(() => {
    const targets = [...elements]
    const callback = handler
    const observer = new IntersectionObserver(callback, {
      threshold,
    })
    targets.forEach((element) => {
      observer.observe(element)
    })
    return observer
  })
}

export { setIntersectionObserver }
