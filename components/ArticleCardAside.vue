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
    <span :class="['article-card__info-wrapper', 'info-wrapper']">
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
  &__info-wrapper {
    margin: 0 0 0 20px;
    // desktop narrow range
    @include media-breakpoint-up(md) {
      margin: 0 0 0 10px;
    }
    // desktop wide range
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 20px;
    }
  }
}

.article-img-wrapper {
  width: 130px;
  min-width: 130px;
  height: 130px;
  min-height: 130px;
  // desktop narrow range
  @include media-breakpoint-up(md) {
    width: 120px;
    min-width: 120px;
    height: 80px;
    min-height: 80px;
  }
  // desktop wide range
  @include media-breakpoint-up(xl) {
    width: 150px;
    min-width: 150px;
    height: 100px;
    min-height: 100px;
  }
}

.article-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  @include default-background-image;
}

.article-title {
  font-size: 16px;
  color: #4a4a4a;
  text-align: left;
  line-height: 1.3;
  word-wrap: break-word;
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
