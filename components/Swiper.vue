<template>
  <div v-swiper:mySwiper="swiperOption" class="swiper">
    <div class="swiper-wrapper">
      <div v-for="(slide, i) in slidesData" :key="i" class="swiper-slide">
        <ArticleCardSwiper
          class="swiper-slide__slide"
          :href="slide.href"
          :articleImgURL="slide.articleImgURL"
          :articleTitle="slide.articleTitle"
          @click.native="$emit('click-slide')"
        />
      </div>
    </div>
    <button
      v-if="isMultipleSlides"
      class="swiper-button-nav swiper-button-nav--prev swiper-nav swiper-nav--left"
      @click="mySwiper.slidePrev()"
    >
      <span />
    </button>
    <button
      v-if="isMultipleSlides"
      class="swiper-button-nav swiper-button-nav--next swiper-nav swiper-nav--right"
      @click="mySwiper.slideNext()"
    >
      <span />
    </button>
    <div class="swiper-pagination" />
  </div>
</template>

<script>
// There is a issue about autoplay not working with nuxt
// https://github.com/surmon-china/vue-awesome-swiper/issues/688#issuecomment-660924010
import { Swiper as SwiperClass, Autoplay, Pagination } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
import ArticleCardSwiper from '~/components/ArticleCardSwiper'
SwiperClass.use([Autoplay, Pagination])
const { directive } = getAwesomeSwiper(SwiperClass)

export default {
  components: {
    ArticleCardSwiper,
  },
  directives: {
    swiper: directive,
  },
  props: {
    slidesData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isMultipleSlides() {
      return this.slidesData.length > 1
    },
    swiperOptionAutoplay() {
      if (this.isMultipleSlides) {
        return {
          delay: 5000,
          disableOnInteraction: false,
        }
      }
      return false
    },
    swiperOption() {
      return {
        loop: this.isMultipleSlides,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: this.swiperOptionAutoplay,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'swiper/swiper-bundle.css';

.swiper {
  overflow: hidden;
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  &__slide {
    @include media-breakpoint-up(xl) {
      width: 80% !important;
    }
  }
}

.swiper-nav {
  position: absolute;
  top: auto;
  bottom: -5px;
  z-index: 1000;
  @include media-breakpoint-up(xl) {
    top: calc(50% - 48px);
    bottom: auto;
  }
  &--left {
    left: 20px;
    right: auto;
    @include media-breakpoint-up(xl) {
      left: 10px;
    }
  }
  &--right {
    left: auto;
    right: 20px;
    @include media-breakpoint-up(xl) {
      right: 10px;
    }
  }
}

.swiper-button-nav {
  padding: 10px;
  span {
    display: block;
    width: 28px;
    height: 28px;
    border-left: 4px solid $color-blue;
    border-bottom: 4px solid $color-blue;
    transform: rotate(45deg);
    outline: none;
  }
  &--next {
    span {
      transform: rotate(-135deg);
    }
  }
}

.swiper-pagination {
  position: static;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 60px 0 60px;
  font-size: 16px;
  color: #4a4a4a;
  height: 50px;
  @include media-breakpoint-up(xl) {
    justify-content: flex-end;
    height: auto;
  }
  ::v-deep .swiper-pagination-current {
    padding: 0 5px;
    font-weight: bold;
    color: #004ebc;
  }
  ::v-deep .swiper-pagination-total {
    padding: 0 0 0 5px;
  }
}
</style>
