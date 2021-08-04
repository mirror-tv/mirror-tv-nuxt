<template>
  <div v-if="hasItems" class="editor-choices">
    <slot />
    <div class="editor-choices-container">
      <ClientOnly>
        <YoutubeEmbedByIframeApi
          :videoId="highlightId"
          class="editor-choices__first-item item"
          @is-ended="setTimer()"
          @is-playing="videoIsPlaying = true"
          @send-first-play-ga="sendGaPlayEvent('editors choice video')"
        />
      </ClientOnly>
      <div class="editor-choices__remaining">
        <div class="scrollable-container">
          <div
            v-for="item in items"
            :key="item.slug"
            :class="{ highlight: item.slug === highlightSlug }"
            class="item"
            @click="selectItemToHighlight(item)"
          >
            <picture>
              <img :src="getImage(item)" :alt="item.name" />
              <div class="g-video-news-img-icon-wrapper">
                <div class="g-video-news-img-icon" />
              </div>
            </picture>
            <span v-text="item.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendGaEvent } from '~/utils/google-analytics'
import { handleYoutubeId } from '~/utils/text-handler'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'

export default {
  components: {
    YoutubeEmbedByIframeApi,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentHighlightIndex: 0,
      highlightItem: this.items.slice(0, 1)[0] || {},
      timer: undefined,
      videoIsPlaying: false,
    }
  },
  computed: {
    highlightSlug() {
      return this.highlightItem?.slug
    },
    highlightId() {
      const url = this.highlightItem?.heroVideo?.url ?? ''
      return url ? handleYoutubeId(url) : ''
    },
    hasItems() {
      return this.items?.length
    },
    itemsAmount() {
      return this.items.length
    },
  },
  watch: {
    items(value) {
      this.highlightItem = value.slice(0, 1)[0] || {}
    },
    highlightItem(value) {
      this.currentHighlightIndex = this.items.findIndex(
        (item) => item?.slug === value?.slug
      )
    },
    videoIsPlaying(isPlaying) {
      isPlaying && clearInterval(this.timer)
    },
  },
  mounted() {
    this.setTimer()
  },
  methods: {
    selectItemToHighlight(item) {
      this.highlightItem = item
      this.$emit('click')
    },
    sendGaPlayEvent(label) {
      sendGaEvent(this.$ga)('videonews')('play')(label)
    },
    setTimer() {
      this.timer = setInterval(this.setVideoCarousel, 5000)
    },
    setVideoCarousel() {
      if (this.currentHighlightIndex + 1 > this.itemsAmount - 1) {
        this.highlightItem = this.items[0]
      } else {
        this.highlightItem = this.items[this.currentHighlightIndex + 1]
      }
    },
    getImage(item) {
      return (
        (item.heroImage?.urlMobileSized ||
          item.heroVideo?.coverPhoto?.urlDesktopSized ||
          item.heroVideo?.coverPhoto?.urlOriginal) ??
        require('~/assets/img/image-default.png')
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  display: block;
  picture {
    display: block;
    position: relative;
    padding-top: 66.66%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  span {
    display: block;
  }
}
.editor-choices {
  @include media-breakpoint-up(md) {
    width: 100%;
  }
  &-container {
    // desktop  range
    @include media-breakpoint-up(xl) {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      min-height: 405px;
    }
  }
  &__first-item {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    margin: 20px 0 0;
    // tablet range
    @include media-breakpoint-up(md) {
      left: 0;
      width: 100%;
    }

    // desktop range
    @include media-breakpoint-up(xl) {
      flex: 1;
      max-width: auto;
      //   min-width: 720px;
      margin-right: 24px;
    }
    &.iframe-wrapper {
      padding-top: calc((100% + 40px) * 0.5625);
      @include media-breakpoint-up(xl) {
        padding-top: calc(318px * 0.5625);
      }
      @include media-breakpoint-up(xxl) {
        padding-top: calc(720px * 0.5625);
      }
    }
    span {
      padding: 20px;
      color: #fff;
      background-color: $color-blue;
    }
  }
  &__remaining {
    margin-top: 16px;
    width: calc(100% + 24px);
    padding: 8px 0;
    transform: translateX(-12px);
    border: 1px solid #d8d8d8;
    // tablet range
    @include media-breakpoint-up(md) {
      position: relative;
      flex: 1;
      transform: translateX(0);
      width: auto;
      margin: 16px 0 0;
      padding: 0;
      overflow: hidden;
    }

    // desktop range
    @include media-breakpoint-up(xl) {
      max-width: 456px;
      margin: 20px 0 0;
    }
    .item {
      display: flex;
      padding: 10px 20px;
      cursor: pointer;
      &.highlight {
        background-color: $color-grey;
      }
      picture {
        width: 120px;
        padding-top: calc(120px * 0.6666);
      }
      span {
        flex: 1;
        margin-left: 10px;
        color: #4a4a4a;
        font-size: 14px;
        line-height: 1.29;
        text-align: justify;
      }
    }
  }
  .scrollable-container {
    // desktop range
    @include media-breakpoint-up(xl) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      min-height: 405px;
      overflow-y: auto;
    }
  }
}
</style>
