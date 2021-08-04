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

export { handleLineBreak, handleYoutubeId }
