function handleError($nuxt, statusCode) {
  const is5xxError = /^5[0-9]/
  is5xxError.test(statusCode)
    ? $nuxt.error({ statusCode: 500 })
    : $nuxt.error({ statusCode: 404 })
}

export { handleError }
