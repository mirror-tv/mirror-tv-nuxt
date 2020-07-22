<template>
  <a
    class="article-card"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="article-img-wrapper">
      <img v-lazy="articleImgURL" class="article-img" alt="article-img" />
    </span>
    <span :class="['bottom-wrapper__info-wrapper', 'info-wrapper']">
      <span class="article-title" v-text="articleTitle" />
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: ''
    },
    articleImgURL: {
      type: String,
      default: require('~/assets/img/default image-2.jpg')
    },
    articleTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
