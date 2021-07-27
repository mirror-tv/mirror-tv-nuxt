<template>
  <div v-if="hasItems" class="list-slides">
    <ol
      :style="{
        transform: transformStyle,
      }"
      class="list-slides-container"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="item"
        @click="$emit('click-slide-item')"
      >
        <a
          v-if="item.img"
          :href="`/show/${currentShow}/${item.id}`"
          rel="noreferer noopener"
          class="item__image"
        >
          <img src="~assets/img/image-default.png" :alt="item.title" />
        </a>
        <YoutubeEmbedByIframeApi v-else :videoId="item.id" />
        <h4 class="item__title" v-text="item.title" />
      </li>
    </ol>
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
    currentShow: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isMobile: false,
      isTablet: false,
      margin: 16,
      pageIndex: 1,
    }
  },
  computed: {
    canSlideNext() {
      if (this.isMobile) {
        return this.items.length > this.pageIndex * 2
      }
      if (this.isTablet) {
        return this.items.length > this.pageIndex * 3
      }
      return this.items.length > this.pageIndex * 4
    },
    canSlidePrev() {
      return this.pageIndex > 1
    },
    hasItems() {
      return this.items.length > 0
    },
    transformStyle() {
      return `translateX(calc(-${(this.pageIndex - 1) * 100}% - ${
        (this.pageIndex - 1) * this.margin
      }px))`
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
      if (viewportWidth < 768) {
        this.isMobile = true
        this.margin = 16
      }
      if (viewportWidth >= 768 && viewportWidth < 1200) {
        this.isTablet = true
        this.margin = 32
      }
      if (viewportWidth >= 1200 && viewportWidth < 1440) {
        this.margin = 32
      }
    },
    handleSlideNext() {
      this.pageIndex += 1
    },
    handleSlidePrev() {
      this.pageIndex -= 1
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
  width: calc((100% - 16px) / 2);
  @include media-breakpoint-up(md) {
    width: calc((100% - 64px) / 3);
  }
  @include media-breakpoint-up(xl) {
    width: calc((100% - 96px) / 4);
  }
  @include media-breakpoint-up(xxl) {
    width: calc((100% - 48px) / 4);
  }
  + .item {
    margin-left: 16px;
    @include media-breakpoint-up(md) {
      margin-left: 32px;
    }
    @include media-breakpoint-up(xxl) {
      margin-left: 16px;
    }
  }
  &__image {
    position: relative;
    display: block;
    width: 100%;
    padding-top: 56.25%;
    font-size: 12px;
    background-color: $color-grey;
    @include media-breakpoint-up(lg) {
      //   height: 120px;
    }
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
  top: 45px;
  transform: translate(0, -50%);
  z-index: 1;
  width: 35px;
  height: 35px;
  outline: none;
  @include media-breakpoint-up(sm) {
    top: calc((100% - 40px) / 2);
  }
  @include media-breakpoint-up(md) {
    top: calc((100% - 90px) / 2);
  }
  @include media-breakpoint-up(xl) {
    width: 45px;
    height: 45px;
    top: calc((100% - 80px) / 2);
  }
  &__arrow {
    position: relative;
    height: 100%;
    background-color: #4a4a4a;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 13px;
      height: 13px;
      border: 2px solid #fff;
      border-color: transparent transparent #fff #fff;
      transform: translate(calc(-50% + 3px), -50%) rotate(45deg);
    }
  }
  &.prev {
    left: 1px;
    padding: 5px 5px 5px 0;
  }
  &.next {
    right: 1px;
    padding: 5px 0 5px 5px;
    .slide-btn__arrow {
      &::after {
        border-color: #fff #fff transparent transparent;
        transform: translate(calc(-50% - 3px), -50%) rotate(45deg);
      }
    }
  }
}
</style>
