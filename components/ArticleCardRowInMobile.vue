<template>
  <div>
    <MicroAd v-if="isMicroAd" :unitId="microAdId" class="micro-ad" />
    <a
      v-else
      class="article-card"
      :href="href"
      target="_blank"
      rel="noreferrer noopener"
    >
      <span class="top-wrapper">
        <span
          v-if="showLabelTitleWrapper(labelTitle)"
          class="top-wrapper__label-title-wrapper label-title-wrapper"
        >
          <span class="label-title" v-text="labelTitle" />
        </span>
      </span>
      <span
        :class="[
          'article-card__bottom-wrapper',
          'bottom-wrapper',
          'row-mobile',
        ]"
      >
        <span :class="['article-img-wrapper', 'shrink']">
          <img v-lazy="articleImgURL" class="article-img" alt="article-img" />
          <span v-if="isVideoNews" class="g-video-news-img-icon-wrapper">
            <span class="g-video-news-img-icon" />
          </span>
        </span>
        <span
          :class="[
            'bottom-wrapper__info-wrapper',
            'bottom-wrapper__info-wrapper--margin-left',
            'info-wrapper',
          ]"
        >
          <span class="article-title" v-text="articleTitle" />
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
    labelTitle: {
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
    isVideoNews() {
      return this.articleStyle === 'videoNews'
    },
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY/MM/DD HH:mm')
    },
    showLabelTitleWrapper(title) {
      return title !== ''
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

.top-wrapper {
  display: flex;
  width: 100%;
}

.label-title-wrapper {
  height: 20px;
  background-color: $color-grey;
  padding: 0 10px;
  display: flex;
  max-width: calc(130px / 2);
  @include media-breakpoint-up(xl) {
    max-width: 50%;
  }
}

.label-title {
  font-size: 14px;
  color: $color-blue-deep;
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

  &__info-wrapper {
    &--margin-left {
      margin: 0 0 0 20px;
      @include media-breakpoint-up(xl) {
        margin: 11px 0 0 0;
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

.article-date {
  font-size: 14px;
  color: #9b9b9b;
}
</style>
