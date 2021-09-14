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
  if (contact.anchorImg) {
    return (
      contact.anchorImg?.urlMobileSized ||
      contact.anchorImg?.urlDesktopSized ||
      contact.anchorImg?.urlTabletSized ||
      contact.anchorImg?.urlOriginal ||
      require('~/assets/img/image-default.jpg')
    )
  }
  if (contact.showhostImg) {
    return (
      contact.showhostImg?.urlMobileSized ||
      contact.showhostImg?.urlDesktopSized ||
      contact.showhostImg?.urlTabletSized ||
      contact.showhostImg?.urlOriginal ||
      require('~/assets/img/image-default.jpg')
    )
  }
  return require('~/assets/img/image-default.jpg')
}

function getBannerImageUrl(bannerImg) {
  return (
    bannerImg?.urlDesktopSized ||
    bannerImg?.urlTabletSized ||
    bannerImg?.urlMobileSized ||
    bannerImg?.urlOriginal ||
    require('~/assets/img/image-default.jpg')
  )
}

export {
  getPostImageUrl,
  getVideoImageUrl,
  getContactImageUrl,
  getBannerImageUrl,
}
