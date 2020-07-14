<template functional>
  <a
    class="article-card-arrow-bar"
    :href="props.href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="top-wrapper">
      <span class="top-wrapper__bar-title-wrapper bar-title-wrapper">
        <span class="bar-title" v-text="props.barTitle" />
      </span>
      <span class="top-wrapper__arrow-icon arrow-icon" />
    </span>
    <span class="bottom-wrapper">
      <img v-lazy="props.articleImgURL" class="article-img" alt="article-img" />
      <span class="bottom-wrapper__info-wrapper info-wrapper">
        <span class="article-title" v-text="props.articleTitle" />
        <span
          class="article-date"
          v-text="$options.methods.formatDate(props.articleDate)"
        />
      </span>
    </span>
  </a>
</template>
c
<script>
import dayjs from 'dayjs'

export default {
  props: {
    href: {
      type: String,
      default: ''
    },
    barTitle: {
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
.article-card-arrow-bar {
  display: block;
  @include media-breakpoint-up(xl) {
    width: 180px;
  }
}

.top-wrapper {
  display: flex;
  width: 100%;
  &__bar-title-wrapper {
    flex: 1 1 auto;
    width: 0;
  }
}

.bar-title-wrapper {
  height: 20px;
  background-color: #ffcc01;
  padding: 0 10px;
  display: flex;
}

.bar-title {
  font-size: 14px;
  color: #003366;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  background-color: #003366;
  &:after {
    content: '';
    width: 10px;
    height: 10px;
    display: block;
    border-top: 1px solid white;
    border-right: 1px solid white;
    transform: rotate(45deg);
    position: relative;
    right: 2px;
  }
}

.bottom-wrapper {
  display: flex;
  @include media-breakpoint-up(xl) {
    flex-direction: column;
  }
}

.article-img {
  width: 46%;
  object-fit: cover;
  @include media-breakpoint-up(xl) {
    width: 100%;
  }
}

.info-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 11px 0 0 20px;
  @include media-breakpoint-up(xl) {
    padding: 11px 0 0 0;
  }
}

.article-title {
  font-size: 16px;
  color: #4a4a4a;
  text-align: justify;
  word-wrap: break-word;
  -webkit-line-clamp: 3;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  font-size: 14px;
  color: #9b9b9b;
  @include media-breakpoint-up(xl) {
    margin: 11px 0 0 0;
  }
}
</style>
