function getImageUrl(post) {
  if (post.style === 'videoNews' && !post.heroImage) {
    const coverPhoto = post.heroVideo?.coverPhoto
    return coverPhoto?.urlMobileSized || coverPhoto?.urlOriginal
  }
  return post.heroImage?.urlMobileSized
}

export { getImageUrl }
