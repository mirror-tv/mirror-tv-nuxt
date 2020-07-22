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
    <span class="info-wrapper">
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
      default: ''
    },
    labelTitle: {
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
    },
    articleDate: {
      type: Date,
      default: () => new Date()
    }
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(xl) {
    width: 581px;
    flex-direction: row;
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
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #014db8;
  padding: 10px 20px 20px 20px;
  @include media-breakpoint-up(xl) {
    padding: 30px 18px;
  }
  &__article-date {
    margin: 11px 0 0 0;
  }
}

.article-title {
  font-size: 18px;
  letter-spacing: 0.43px;
  font-weight: 500;
  color: white;
  text-align: justify;
  word-wrap: break-word;
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
</style>
