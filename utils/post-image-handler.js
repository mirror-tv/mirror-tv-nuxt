function getImageUrl(post) {
  if (post.style === 'videoNews' && !post.heroImage) {
    const coverPhoto = post.heroVideo?.coverPhoto
    return (
      coverPhoto?.urlMobileSized ||
      coverPhoto?.urlOriginal ||
      require('~/assets/img/image-default.jpg')
    )
  }
  return (
    post.heroImage?.urlMobileSized || require('~/assets/img/image-default.jpg')
  )
}

function getVideoImageUrl(post) {
  const coverPhoto = post.heroVideo?.coverPhoto ?? undefined
  return coverPhoto
    ? coverPhoto.urlMobileSized || coverPhoto.urlOriginal
    : post.heroImage?.urlMobileSized ||
        require('~/assets/img/image-default.jpg')
}

function getHostImageUrl(host) {
  return (
    host?.image?.urlMobileSized ||
    host?.image?.urlOriginal ||
    host?.image?.urlTabletSized ||
    require('~/assets/img/image-default.jpg')
  )
}

export { getImageUrl, getVideoImageUrl, getHostImageUrl }
