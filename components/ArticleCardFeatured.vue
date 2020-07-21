<template>
  <a
    class="article-card"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <img v-lazy="articleImgURL" class="article-img" alt="article-img" />
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
      default: ''
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
  display: block;
  @include media-breakpoint-up(xl) {
    width: 581px;
    display: flex;
  }
}

.article-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  @include media-breakpoint-up(xl) {
    width: 381px;
    min-width: 381px;
  }
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
