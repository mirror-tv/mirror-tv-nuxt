<template>
  <a
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
    class="article-card"
  >
    <img class="article-card__img" :src="articleImgURL" :alt="articleTitle" />
    <div class="article-card__info-wrapper">
      <div v-if="hasCategoryOrDate" class="article-card__sub-info">
        <span class="article-card__category" v-text="articleCategory" />
        <span class="article-card__date" v-text="articleDate" />
      </div>
      <h2 class="article-card__title" v-text="articleTitle" />
      <p
        v-if="articleDescription"
        class="article-card__brief"
        v-text="articleDescription"
      />
    </div>
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
      default: require('~/assets/img/image-default.png'),
    },
    articleTitle: {
      type: String,
      default: '',
    },
    articleDescription: {
      type: String,
      default: '',
    },
    articleCategory: {
      type: String,
      default: '',
    },
    articleDate: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasCategoryOrDate() {
      return this.articleCategory || this.articleDate
    },
  },
}
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    @include default-background-image;
  }
  &__info-wrapper {
    flex: 1;
    margin: 0 0 0 10px;
  }
  &__sub-info,
  &__brief {
    display: none;
  }
  &__sub-info {
    @include media-breakpoint-up(lg) {
      display: flex;
      + * {
        margin-top: 5px;
      }
    }
  }
  &__category {
    margin: 0 auto 0 0;
    color: #014db8;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
  }
  &__date {
    margin: 0 0 0 auto;
    font-size: 14px;
    line-height: 1.57;
  }
  &__title {
    display: -webkit-box;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.63;
    text-align: justify;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    @include media-breakpoint-up(lg) {
      line-height: 1.75;
      + * {
        margin-top: 5px;
      }
    }
  }
  &__brief {
    color: #9b9b9b;
    font-size: 14px;
    line-height: 1.57;
    text-align: justify;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    @include media-breakpoint-up(lg) {
      display: -webkit-box;
    }
  }
}
</style>
