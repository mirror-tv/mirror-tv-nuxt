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
      >
        <img v-lazy="getImage(item)" :alt="item.title" class="item__image" />
        <span class="item__title" v-text="item.title" />
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
  name: 'ArticleListSlides',
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
      const margin = this.isMobile ? 14 : 25
      return `translateX(calc(-${(this.pageForSlide - 1) * 100}% - ${
        (this.pageForSlide - 1) * margin
      }px))`
    },
  },
  watch: {
    pageForSlide(value) {
      if (this.canLoadMore) {
        if (this.isMobile && this.pageForSlide * 2 + 4 > this.total) {
          this.pageForItems += 1
          this.$emit('load-more', this.pageForItems)
        } else if (!this.isMobile && this.pageForSlide * 3 + 6 > this.total) {
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
      if (viewportWidth >= 1200) {
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
        require('~/assets/img/default image-2.jpg')
      )
    },
    handleSlideNext() {
      this.pageForSlide += 1
    },
    handleSlidePrev() {
      this.pageForSlide -= 1
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
  width: calc((100% - 14px) / 2);
  vertical-align: top;
  white-space: normal;
  @include media-breakpoint-up(xl) {
    width: calc((100% - 50px) / 3);
  }
  + .item {
    margin-left: 14px;
    @include media-breakpoint-up(xl) {
      margin-left: 25px;
    }
  }
  &__image {
    width: 100%;
    height: 87px;
    font-size: 12px;
    object-fit: cover;
    object-position: center center;
    @include media-breakpoint-up(xl) {
      height: 120px;
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
  top: 50%;
  transform: translate(0, -50%);
  z-index: 1;
  width: 45px;
  height: 45px;
  &.prev {
    left: 1px;
    padding: 5px 5px 5px 0;
    @include media-breakpoint-up(xl) {
      left: 4px;
    }
  }
  &.next {
    right: 1px;
    padding: 5px 0 5px 5px;
    @include media-breakpoint-up(xl) {
      right: 4px;
    }
    .slide-btn__arrow {
      &::after {
        border-color: rgba(1, 77, 184, 0.6) rgba(1, 77, 184, 0.6) transparent
          transparent;
        transform: translate(calc(-50% - 3px), -50%) rotate(45deg);
      }
    }
  }
  &__arrow {
    position: relative;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 13px;
      height: 13px;
      border: 2px solid rgba(1, 77, 184, 0.6);
      border-color: transparent transparent rgba(1, 77, 184, 0.6)
        rgba(1, 77, 184, 0.6);
      transform: translate(calc(-50% + 3px), -50%) rotate(45deg);
    }
  }
}
</style>
