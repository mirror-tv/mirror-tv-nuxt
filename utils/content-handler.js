import { getPostImageUrl } from './image-handler'

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
    const rawString = apiData ?? ''
    const content = JSON.parse(rawString)

    return content?.filter((item) => item) || []
  } catch {
    return []
  }
}

function handleArticleContent(post) {
  return {
    href: `/story/${post.slug}` ?? '',
    labelTitle: post.categories?.[0]?.name ?? '',
    articleTitleHighlightText: '',
    articleImgURL: getPostImageUrl(post),
    articleTitle: post.name ?? '',
    articleDescription: '',
    articleDate: new Date(post.publishTime) ?? Date.now(),
    articleStyle: post.style ?? '',
    isMicroAd: post.isMicroAd ?? false,
    microAdId: post.microAdId ?? '',
  }
}

function handleMetaDesc(str) {
  if (!str || typeof str !== 'string') {
    return ''
  }
  // remove html tags and set length limit for meta descripton
  const pureStr = str?.replace(/<[^>]*>?/gm, '')
  const formatedStr = pureStr?.slice(0, 124) ?? ''
  return formatedStr.length > 123 ? formatedStr + '...' : formatedStr
}

export {
  handleLineBreak,
  handleYoutubeId,
  handleApiData,
  handleArticleContent,
  handleMetaDesc,
}
