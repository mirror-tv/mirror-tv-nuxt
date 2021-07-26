function getPdfUrl(contextConfig, slug) {
  const target =
    contextConfig.releaseTarget === 'local'
      ? 'dev'
      : contextConfig.releaseTarget
  const pdfUrls = [
    {
      'press-self-regulation': `https://storage.googleapis.com/static-mnews-tw-${target}/regulation/press-self-regulation.pdf`,
    },
  ]
  const item = pdfUrls.find((item) => Object.keys(item)[0] === slug)
  return item ? item[slug] : ''
}

export { getPdfUrl }
