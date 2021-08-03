function getImageUrl(post) {
  if (post.style === 'videoNews' && !post.heroImage) {
    const coverPhoto = post.heroVideo?.coverPhoto
    return (
      coverPhoto?.urlMobileSized ||
      coverPhoto?.urlOriginal ||
      require('~/assets/img/image-default.png')
    )
  }
  return (
    post.heroImage?.urlMobileSized || require('~/assets/img/image-default.png')
  )
}

function getVideoImageUrl(post) {
  const coverPhoto = post.heroVideo?.coverPhoto ?? undefined
  return coverPhoto
    ? coverPhoto.urlMobileSized || coverPhoto.urlOriginal
    : post.heroImage?.urlMobileSized ||
        require('~/assets/img/image-default.png')
}

function getHostImageUrl(host) {
  return (
    host?.image?.urlMobileSized ||
    host?.image?.urlOriginal ||
    require('~/assets/img/image-default.png')
  )
}

export { getImageUrl, getVideoImageUrl, getHostImageUrl }
