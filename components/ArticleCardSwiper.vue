<template>
  <a
    class="article-card"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="article-img-wrapper">
      <img :src="articleImgURL" class="article-img" alt="article-img" />
    </span>
    <span
      :class="[
        'bottom-wrapper__info-wrapper',
        'bottom-wrapper__info-wrapper--margin-right',
        'info-wrapper',
      ]"
    >
      <span class="article-title" v-text="articleTitle" />
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '',
    },
    articleImgURL: {
      type: String,
      default: require('~/assets/img/default/image-default.jpg'),
    },
    articleTitle: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.article-img-wrapper {
  display: inline-block;
  width: 100%;
  height: 0;
  padding-top: 66.66%;
  position: relative;
  @include media-breakpoint-up(xl) {
    padding-top: 0;
    height: 220px;
    min-height: 220px;
  }
}

.article-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  @include default-background-image;
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: $color-blue;
  height: 100px;
  padding: 8px 20px;
  @include media-breakpoint-up(xl) {
    height: 76px;
  }
}

.article-title {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 0.48px;
  color: #fff;
  text-align: left;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
