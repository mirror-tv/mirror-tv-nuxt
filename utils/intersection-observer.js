async function setIntersectionObserver({
  elements = [],
  threshold = 1,
  handler,
}) {
  await import('intersection-observer').then(() => {
    try {
      const callback = handler
      const observer = new IntersectionObserver(callback, {
        threshold,
        root: document.body,
      })
      elements.forEach((element) => {
        observer.observe(element)
      })
      return observer
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('set IntersectionObserver error', error)
    }
  })
}

export { setIntersectionObserver }
