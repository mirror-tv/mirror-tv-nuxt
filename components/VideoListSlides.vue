<template>
  <div v-if="total" class="list-slides">
    <div
      :style="{
        transform: transformStyle,
      }"
      class="list-slides-container"
    >
      <div
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        class="item"
      >
        <ClientOnly>
          <YoutubeEmbedByIframeApi
            :videoId="item.id"
            class="item__image"
            @send-first-play-ga="handleClickVideo"
          />
        </ClientOnly>
      </div>
    </div>
    <button v-if="canSlidePrev" class="slide-btn prev" @click="handleSlidePrev">
      <div class="slide-btn__arrow" />
    </button>
    <button v-if="canSlideNext" class="slide-btn next" @click="handleSlideNext">
      <div class="slide-btn__arrow" />
    </button>
  </div>
</template>

<script>
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
      pageForSlide: 1,
      pageForItems: 1,
    }
  },
  computed: {
    total() {
      return this.items?.length ?? 0
    },
    canSlideNext() {
      return this.pageForSlide < Math.ceil(this.total / 3)
    },
    canSlidePrev() {
      return this.pageForSlide > 1 && this.items.length > 3
    },
    transformStyle() {
      return `translateX(calc(-${(this.pageForSlide - 1) * 100}% - ${
        (this.pageForSlide - 1) * 20
      }px))`
    },
  },
  watch: {
    pageForSlide(newVal, oldVal) {
      if (newVal > oldVal) {
        this.pageForItems += 1
      }
    },
  },
  methods: {
    handleClickVideo() {
      this.$emit('click-slide-item')
    },
    handleSlideNext() {
      this.pageForSlide += 1
      this.$emit('click-slide-next-and-pre')
    },
    handleSlidePrev() {
      this.pageForSlide -= 1
      this.$emit('click-slide-next-and-pre')
    },
  },
}
</script>

<style lang="scss" scoped>
.list-slides {
  position: relative;
  overflow: hidden;
  &-container {
    white-space: nowrap;
    transition: transform 0.5s ease-in;
  }
}
.item {
  display: inline-block;
  vertical-align: top;
  white-space: normal;
  @include media-breakpoint-up(md) {
    width: calc((100% - 40px) / 3);
  }
  + .item {
    margin-left: 16px;
    @include media-breakpoint-up(md) {
      margin-left: 20px;
    }
  }
  &__image {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    font-size: 12px;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
      @include default-background-image;
    }
  }
  &__title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-top: 10px;
    color: #4a4a4a;
    text-align: justify;
    word-wrap: break-word;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
.slide-btn {
  position: absolute;
  z-index: 1;
  width: 48px;
  height: 81px;
  outline: none;
  &:hover,
  &:active,
  &:focus {
    box-shadow: none;
    background-color: transparent;
  }
  @include media-breakpoint-up(md) {
    top: 22px;
  }
  @include media-breakpoint-up(xl) {
    width: 64px;
    height: 96px;
    top: 60px;
  }
  &__arrow {
    position: relative;
    height: 100%;
    background-color: #f4f5f6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 13px;
      height: 13px;
      border: 2px solid #2c585e;
      border-color: transparent transparent #2c585e #2c585e;
      transform: translate(calc(-50% + 3px), -50%) rotate(45deg);
    }
    &:hover,
    &:active {
      background-color: #4a4a4a;
      opacity: 0.8;
      &::after {
        border: 2px solid #fff;
        border-color: transparent transparent #fff #fff;
      }
    }
  }
  &.prev {
    left: 0;
    padding: 24px 12px 24px 0;
  }
  &.next {
    right: 0;
    padding: 24px 0 24px 12px;
    .slide-btn__arrow {
      &::after {
        border-color: #2c585e #2c585e transparent transparent;
        transform: translate(calc(-50% - 3px), -50%) rotate(45deg);
      }
      &:hover,
      &:active {
        background-color: #4a4a4a;
        opacity: 0.8;
        &::after {
          border: 2px solid #fff;
          border-color: #fff #fff transparent transparent;
        }
      }
    }
  }
}
</style>
