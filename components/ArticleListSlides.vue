<template>
  <div v-if="hasItems" class="list-slides">
    <div
      :style="{
        transform: transformStyle,
      }"
      class="list-slides-container"
    >
      <a
        v-for="(item, index) in items"
        :key="`${item.slug}-${index}`"
        :href="`/story/${item.slug}`"
        class="item"
        target="_blank"
        @click="$emit('click-slide-item')"
      >
        <div class="item__image">
          <img v-lazy="getImage(item)" :alt="item.name" />
          <div class="g-video-news-img-icon-wrapper">
            <div class="g-video-news-img-icon" />
          </div>
        </div>
        <span class="item__title" v-text="item.name" />
      </a>
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
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      canSlide: false,
      isMobile: true,
      pageForSlide: 1,
      pageForItems: 1,
    }
  },
  computed: {
    canLoadMore() {
      return this.items.length < this.total
    },
    canSlideNext() {
      if (this.isMobile) {
        return this.pageForSlide < Math.ceil(this.maximum / 2)
      }
      return this.pageForSlide < Math.ceil(this.maximum / 3)
    },
    canSlidePrev() {
      if (this.isMobile) {
        return this.pageForSlide > 1 && this.items.length > 2
      }
      return this.pageForSlide > 1 && this.items.length > 3
    },
    hasItems() {
      return this.items.length > 0
    },
    maximum() {
      if (this.isMobile) {
        return this.total > 20 ? 20 : this.total
      }
      return this.total > 30 ? 30 : this.total
    },
    transformStyle() {
      const margin = this.isMobile ? 16 : 20
      const marginNum = this.isMobile ? 2 : 1
      return `translateX(calc(-${(this.pageForSlide - 1) * 100}% - ${
        (this.pageForSlide - 1) * margin * marginNum
      }px))`
    },
  },
  watch: {
    pageForSlide(newVal, oldVal) {
      if (this.canLoadMore && newVal > oldVal) {
        if (this.isMobile && this.pageForSlide * 2 + 2 >= this.items.length) {
          this.pageForItems += 1
          this.$emit('load-more', this.pageForItems)
        } else if (
          !this.isMobile &&
          this.pageForSlide * 3 + 3 >= this.items.length
        ) {
          this.pageForItems += 1
          this.$emit('load-more', this.pageForItems)
        }
      }
    },
  },
  mounted() {
    this.detectViewport()
  },
  methods: {
    detectViewport() {
      const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (viewportWidth > 767) {
        this.isMobile = false
      }
    },
    detectListSlidable() {
      if (!this.isMobile && this.items.length > 3) {
        this.canSlideNext = true
      } else if (this.isMobile && this.items.length > 2) {
        this.canSlideNext = true
      }
    },
    getImage(post) {
      return (
        post.heroImage?.urlMobileSized ??
        require('~/assets/img/image-default.jpg')
      )
    },
    handleSlideNext() {
      this.pageForSlide += 1
      this.$emit('click-slide-next')
    },
    handleSlidePrev() {
      this.pageForSlide -= 1
      this.$emit('click-slide-prev')
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
  width: calc((100%) / 2);
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
  top: calc((100vw - 32px) * 0.5 * 0.5625 * 0.5 - 36px);
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
    &:hover {
      background-color: #4a4a4a;
      opacity: 0.8;
      &::after {
        border: 2px solid #fff;
        border-color: transparent transparent #fff #fff;
      }
    }
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
      &:hover {
        background-color: #4a4a4a;
        opacity: 0.8;
        &::after {
          border: 2px solid #fff;
          border-color: #fff #fff transparent transparent;
        }
      }
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
