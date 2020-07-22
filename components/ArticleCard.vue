<template functional>
  <a
    class="article-card"
    :href="props.href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span class="top-wrapper">
      <span
        v-if="$options.methods.showLabelTitleWrapper(props.labelTitle)"
        class="top-wrapper__label-title-wrapper label-title-wrapper"
      >
        <span class="label-title" v-text="props.labelTitle" />
      </span>
    </span>
    <span
      :class="[
        'article-card__bottom-wrapper',
        'bottom-wrapper',
        `${props.mobileLayoutDirection}-mobile`
      ]"
    >
      <span
        :class="[
          'article-img-wrapper',
          $options.methods.getArticleImgExpandModeByDirection(
            props.mobileLayoutDirection
          )
        ]"
      >
        <img
          v-lazy="props.articleImgURL"
          class="article-img"
          alt="article-img"
        />
      </span>
      <span
        :class="[
          'bottom-wrapper__info-wrapper',
          `bottom-wrapper__info-wrapper--${$options.methods.getInfoWrapperModifier(
            props.mobileLayoutDirection
          )}`,
          'info-wrapper'
        ]"
      >
        <span class="article-title" v-text="props.articleTitle" />
        <span
          class="info-wrapper__article-date article-date"
          v-text="$options.methods.formatDate(props.articleDate)"
        />
      </span>
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
    },

    // Differentiate two usages in / and /category/:name pages
    mobileLayoutDirection: {
      type: String,
      default: 'row',
      validator(value) {
        return ['row', 'column'].includes(value)
      }
    }
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD HH:mm')
    },
    showLabelTitleWrapper(title) {
      return title !== ''
    },
    getArticleImgExpandModeByDirection(direction) {
      switch (direction) {
        case 'row':
        default:
          return 'shrink'
        case 'column':
          return 'stretch'
      }
    },
    getInfoWrapperModifier(direction) {
      switch (direction) {
        case 'row':
        default:
          return 'margin-left'
        case 'column':
          return 'margin-right'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.article-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  @include media-breakpoint-up(xl) {
    width: 180px;
  }
  &__bottom-wrapper {
    @include media-breakpoint-up(xl) {
      flex: 1 1 auto;
    }
  }
}

.top-wrapper {
  display: flex;
  width: 100%;
}

.label-title-wrapper {
  height: 20px;
  background-color: #e7e7e7;
  padding: 0 10px;
  display: flex;
}

.label-title {
  font-size: 14px;
  color: #003366;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bottom-wrapper {
  &.row-mobile {
    display: flex;
    @include media-breakpoint-up(xl) {
      flex-direction: column;
    }
  }
  &.column-mobile {
    display: flex;
    flex-direction: column;
  }

  &__info-wrapper {
    &--margin-left {
      margin: 0 0 0 20px;
      @include media-breakpoint-up(xl) {
        margin: 11px 0 0 0;
        flex: 1 1 auto;
      }
    }
    &--margin-right {
      margin: 11px 0 0 0;
      @include media-breakpoint-up(xl) {
        flex: 1 1 auto;
      }
    }
  }
}

.article-img-wrapper {
  &.shrink {
    display: inline-block;
    width: 130px;
    min-width: 130px;
    height: 130px;
    min-height: 130px;
    position: relative;
    @include media-breakpoint-up(xl) {
      width: 180px;
      min-width: 180px;
      height: 120px;
      min-height: 120px;
    }
  }
  &.stretch {
    display: inline-block;
    width: 100%;
    height: 0;
    padding-top: 66.66%;
    position: relative;
    @include media-breakpoint-up(xl) {
      width: 180px;
      min-width: 180px;
      height: 120px;
      min-height: 120px;
    }
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
  &__article-date {
    margin: 11px 0 0 0;
  }
}

.article-title {
  font-size: 16px;
  color: #4a4a4a;
  text-align: justify;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    -webkit-line-clamp: 3;
  }
}

.article-date {
  font-size: 14px;
  color: #9b9b9b;
}
</style>
