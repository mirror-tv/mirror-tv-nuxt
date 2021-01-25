<template>
  <div v-if="hasItems" class="editor-choices">
    <slot />
    <div class="editor-choices-container">
      <IframeYoutube
        :videoId="highlightItem.slug"
        class="editor-choices__first-item item"
        @send-first-play-ga="sendGaPlayEvent('editors choice video')"
      />
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
              <img :src="getImage(item)" :alt="item.title" />
              <div class="g-video-news-img-icon-wrapper">
                <div class="g-video-news-img-icon" />
              </div>
            </picture>
            <span v-text="item.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendGaEvent } from '~/utils/google-analytics'
import IframeYoutube from '~/components/IframeYoutube'

export default {
  components: {
    IframeYoutube,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      highlightItem: this.items.slice(0, 1)[0] || {},
    }
  },
  computed: {
    currentHighlightIndex() {
      return this.items?.findIndex(
        (item) => item?.id === this.highlightItem?.id
      )
    },
    highlightSlug() {
      return this.highlightItem?.slug
    },
    hasItems() {
      return this.items.length > 0
    },
    itemsAmount() {
      return this.items.length
    },
  },
  watch: {
    items(value) {
      this.highlightItem = value.slice(0, 1)[0] || {}
    },
  },
  mounted() {
    // For Demo
    setInterval(() => {
      if (this.currentHighlightIndex + 1 > this.itemsAmount - 1) {
        this.highlightItem = this.items[0]
      } else {
        this.highlightItem = this.items[this.currentHighlightIndex + 1]
      }
    }, 2000)
  },
  methods: {
    selectItemToHighlight(item) {
      this.highlightItem = item
      this.$emit('click')
    },
    sendGaPlayEvent(label) {
      sendGaEvent(this.$ga)('videonews')('play')(label)
    },
    getImage(item) {
      return (
        item.heroImage?.urlMobileSized ||
        item.heroVideo?.coverPhoto?.urlDesktopSized ||
        item.heroVideo?.coverPhoto?.urlOriginal
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
  @include media-breakpoint-up(xl) {
    width: 100%;
  }
  &-container {
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  &__first-item {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    margin: 20px 0 0;
    @include media-breakpoint-up(md) {
      left: 0;
      width: 318px;
    }
    @include media-breakpoint-up(xxl) {
      width: 720px;
    }
    &.iframe-wrapper {
      padding-top: calc((100% + 40px) * 0.5625);
      @include media-breakpoint-up(md) {
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
    width: calc(100% + 40px);
    padding: 20px 0;
    transform: translateX(-20px);
    border-bottom: 1px solid #d8d8d8;
    @include media-breakpoint-up(md) {
      position: relative;
      flex: 1;
      transform: translateX(0);
      width: auto;
      margin: 20px 0 0 10px;
      padding: 0;
      border: none;
      overflow: hidden;
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
    @include media-breakpoint-up(xl) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
