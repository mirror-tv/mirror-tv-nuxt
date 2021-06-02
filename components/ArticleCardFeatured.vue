<template>
  <a
    class="article-card"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="article-img-wrapper">
      <img v-lazy="articleImgURL" class="article-img" alt="article-img" />
      <span v-if="isVideoNews" class="article-video-icon-wrapper">
        <img
          src="~/assets/img/video-play-icon.svg"
          alt="play icon"
          class="article-video-icon-img"
        />
      </span>
    </span>
    <span class="article-card__info-wrapper info-wrapper">
      <span class="article-title" v-text="articleTitle" />
      <span
        class="info-wrapper__article-date article-date"
        v-text="formatDate(articleDate)"
      />
    </span>
  </a>
</template>

<script>
import dayjs from 'dayjs'

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
    articleDate: {
      type: Date,
      default: () => new Date(),
    },
    articleStyle: {
      type: String,
      default: null,
    },
  },
  computed: {
    isVideoNews() {
      return this.articleStyle === 'videoNews'
    },
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    flex-direction: row;
  }
  @include media-breakpoint-up(xl) {
    width: 581px;
  }
  &__info-wrapper {
    @include media-breakpoint-up(xl) {
      flex: 1 1 auto;
    }
  }
}

.article-img-wrapper {
  display: inline-block;
  width: 100%;
  height: 0;
  padding-top: 66.66%;
  position: relative;
  @include media-breakpoint-up(xl) {
    padding-top: 0;
    width: 381px;
    min-width: 381px;
    height: 254px;
    min-height: 254px;
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
  justify-content: space-between;
  align-items: flex-start;
  background-color: $color-blue;
  padding: 10px 20px 20px 20px;
  @include media-breakpoint-up(xl) {
    padding: 30px 18px;
  }
  &__article-date {
    margin: 11px 0 0 0;
  }
}

.article-title {
  font-size: 20px;
  letter-spacing: 0.43px;
  font-weight: 500;
  line-height: 28px;
  color: white;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    font-size: 20px;
    letter-spacing: 0.48px;
    -webkit-line-clamp: 3;
  }
}

.article-date {
  font-size: 14px;
  color: white;
}

.article-video-icon {
  &-wrapper {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
  }
  &-img {
    display: inline-block;
    width: 24px;
    height: 14px;
  }
}
</style>
