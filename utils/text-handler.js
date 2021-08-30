function handleLineBreak(text) {
  if (text && typeof text === 'string') {
    return text.replace(/\n|\r\n/g, '<br>')
  } else {
    return ''
  }
}

function handleYoutubeId(url) {
  if (url?.includes('watch?v=')) {
    return url.split('watch?v=')[1] ?? ''
  }
  if (url?.includes('youtu.be')) {
    return url.split('youtu.be/')[1] ?? ''
  }
  return ''
}

function handleApiData(apiData) {
  try {
    const rawString = apiData.replace(/'/g, '"')
    const content = JSON.parse(rawString)

    return content?.filter((item) => item) || []
  } catch {
    return []
  }
}

export { handleLineBreak, handleYoutubeId, handleApiData }
