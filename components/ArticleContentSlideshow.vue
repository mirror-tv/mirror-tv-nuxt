<template>
  <div v-swiper:contentSwiper="swiperOption" class="slideshow">
    <div class="swiper-wrapper">
      <div v-for="item in items" :key="item.title" class="swiper-slide">
        <picture>
          <img :src="item.mobile.url" :alt="item.title" class="swiper-lazy" />
        </picture>
        <p class="caption" v-text="item.title" />
      </div>
    </div>
    <button
      class="swiper-button-nav swiper-button-nav--prev"
      @click="contentSwiper.slidePrev()"
    >
      <span />
    </button>
    <button
      class="swiper-button-nav swiper-button-nav--next"
      @click="contentSwiper.slideNext()"
    >
      <span />
    </button>
    <div class="swiper-pagination" />
  </div>
</template>

<script>
import { Swiper as SwiperClass, Pagination } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
SwiperClass.use([Pagination])
const { directive } = getAwesomeSwiper(SwiperClass)

export default {
  directives: {
    swiper: directive,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
@import 'swiper/swiper-bundle.css';

.slideshow {
  position: relative;
  overflow: hidden;
  .swiper-slide {
    picture {
      display: block;
      position: relative;
      padding-top: 66.66%;
      @include media-breakpoint-up(xl) {
        width: 400px;
        margin: 0 auto;
        padding-top: calc(400px * 0.6666);
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .caption {
      padding-top: 54px;
      color: #4a4a4a;
      font-size: 15px;
      text-align: center;
      @include media-breakpoint-up(xl) {
        padding-top: 37px;
      }
    }
  }
  .swiper-button-nav {
    position: absolute;
    top: calc((100% - 54px - 8px) / 2);
    transform: translateY(-50%);
    left: -2px;
    z-index: 20;
    padding: 10px;
    outline: none;
    > span {
      display: block;
      width: 28px;
      height: 28px;
      border-left: 4px solid $color-blue;
      border-bottom: 4px solid $color-blue;
      transform: rotate(45deg);
    }
    @include media-breakpoint-up(xl) {
      top: 116px;
    }
    &--next {
      left: auto;
      right: -2px;
      > span {
        transform: rotate(-135deg);
      }
    }
  }
  .swiper-pagination {
    top: calc((100vw - 40px) * 2 / 3 + 20px);
    font-size: 16px;
    @include media-breakpoint-up(xl) {
      top: calc((400px) * 2 / 3 + 10px);
    }
    ::v-deep .swiper-pagination-current {
      color: #004ebc;
      font-weight: bold;
    }
  }
}
</style>
