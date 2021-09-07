function getPostImageUrl(post) {
  if (post.style === 'videoNews' && !post.heroImage) {
    const coverPhoto = post.heroVideo?.coverPhoto
    return (
      coverPhoto?.urlMobileSized ||
      coverPhoto?.urlDesktopSized ||
      coverPhoto?.urlTabletSized ||
      coverPhoto?.urlOriginal ||
      require('~/assets/img/image-default.jpg')
    )
  }
  return (
    post.heroImage?.urlMobileSized ||
    post.heroImage?.urlDesktopSized ||
    post.heroImage?.urlTabletSized ||
    post.heroImage?.urlOriginal ||
    require('~/assets/img/image-default.jpg')
  )
}

function getVideoImageUrl(post) {
  const coverPhoto = post.heroVideo?.coverPhoto ?? undefined
  return coverPhoto
    ? coverPhoto.urlMobileSized ||
        coverPhoto.urlDesktopSized ||
        coverPhoto.urlTabletSized ||
        coverPhoto.urlOriginal ||
        require('~/assets/img/image-default.jpg')
    : post.heroImage?.urlMobileSized ||
        post.heroImage?.urlDesktopSized ||
        post.heroImage?.urlTabletSized ||
        post.heroImage?.urlOriginal ||
        require('~/assets/img/image-default.jpg')
}

function getContactImageUrl(contact) {
  return (
    contact.image?.urlMobileSized ||
    contact.image?.urlDesktopSized ||
    contact.image?.urlTabletSized ||
    contact.image?.urlOriginal ||
    require('~/assets/img/image-default.jpg')
  )
}

function getBannerImageUrl(show) {
  return (
    show.bannerImg?.urlDesktopSized ||
    show.bannerImg?.urlTabletSized ||
    show.bannerImg?.urlMobileSized ||
    show.bannerImg?.urlOriginal ||
    require('~/assets/img/image-default.jpg')
  )
}

export {
  getPostImageUrl,
  getVideoImageUrl,
  getContactImageUrl,
  getBannerImageUrl,
}
