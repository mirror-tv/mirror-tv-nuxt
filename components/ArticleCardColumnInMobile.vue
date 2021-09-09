<template>
  <div>
    <!-- <template v-if="isMicroAd">
      <ClientOnly>
        <MicroAd :unitId="microAdId" class="micro-ad" />
      </ClientOnly>
    </template> -->
    <MicroAd v-if="isMicroAd" :unitId="microAdId" />
    <a
      v-else
      class="article-card"
      :href="href"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span
        :class="[
          'article-card__bottom-wrapper',
          'bottom-wrapper',
          'column-mobile',
        ]"
      >
        <span :class="['article-img-wrapper', 'stretch']">
          <img v-lazy="articleImgURL" class="article-img" alt="article-img" />
          <span v-if="isVideoNews" class="g-video-news-img-icon-wrapper">
            <span class="g-video-news-img-icon" />
          </span>
        </span>
        <span
          :class="[
            'bottom-wrapper__info-wrapper',
            'bottom-wrapper__info-wrapper--margin-right',
            'info-wrapper',
          ]"
        >
          <!-- eslint-disable vue/no-v-html -->
          <span
            class="article-title"
            :style="{ fontWeight: articleTitleStyle }"
            v-html="articleTitleProcessed"
          />
          <span
            class="article-description"
            v-text="articleDescriptionTruncated"
          />
          <span
            class="info-wrapper__article-date article-date"
            v-text="formatDate(articleDate)"
          />
        </span>
      </span>
    </a>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import MicroAd from '~/components/MicroAd'

export default {
  components: {
    MicroAd,
  },
  props: {
    href: {
      type: String,
      default: '',
    },
    articleImgURL: {
      type: String,
      default: require('~/assets/img/image-default.jpg'),
    },
    articleTitle: {
      type: String,
      default: '',
    },
    articleTitleStyle: {
      type: String,
      default: 'normal',
    },
    articleTitleHighlightText: {
      type: String,
      default: '',
    },
    articleDescription: {
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
    isMicroAd: {
      type: Boolean,
      default: false,
    },
    microAdId: {
      type: String,
      default: '',
    },
  },
  computed: {
    articleDescriptionTruncated() {
      const limit = 45
      if (this.articleDescription.length <= limit) {
        return this.articleDescription
      }
      return this.articleDescription.substring(0, limit).concat('...')
    },
    articleTitleProcessed() {
      if (!this.articleTitleHighlightText) {
        return this.articleTitle
      }

      const hightlightTextMapping = Object.fromEntries(
        this.articleTitleHighlightText
          .split(' ')
          .map((text) => [text, `<span style="color: #014db8">${text}</span>`])
      )

      const re = new RegExp(Object.keys(hightlightTextMapping).join('|'), 'gi')
      return this.articleTitle.replace(re, function (matched) {
        return hightlightTextMapping[matched]
      })
    },
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
  height: 100%;
  @include media-breakpoint-up(xl) {
    width: 100%;
  }
  &__bottom-wrapper {
    @include media-breakpoint-up(xl) {
      flex: 1 1 auto;
    }
  }
}

.bottom-wrapper {
  &.column-mobile {
    display: flex;
    flex-direction: column;
  }

  &__info-wrapper {
    &--margin-right {
      margin: 11px 0 0 0;
      @include media-breakpoint-up(xl) {
        flex: 1 1 auto;
      }
    }
  }
}

.article-img-wrapper {
  &.stretch {
    display: inline-block;
    width: 100%;
    height: 0;
    padding-top: 66.66%;
    position: relative;
    @include media-breakpoint-up(xl) {
      width: 100%;
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
  @include default-background-image;
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
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    -webkit-line-clamp: 3;
  }
}

.article-description {
  font-size: 16px;
  color: #4a4a4a;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  margin: 10px 0 0 0;
}

.article-date {
  font-size: 14px;
  color: #9b9b9b;
}
</style>
