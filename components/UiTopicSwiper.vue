<template>
  <div v-swiper:mySwiper="swiperOption" class="swiper">
    <div class="swiper-wrapper">
      <div
        v-for="(slide, i) in slidesData"
        :key="slide.id"
        class="swiper-slide"
      >
        <template v-if="isVideo">
          <div class="video">
            <ClientOnly>
              <YoutubeEmbedByIframeApi
                :ref="`video-${i}`"
                :videoId="slide.youtubeId"
                :enableAutoplay="i === 0"
              />
            </ClientOnly>
          </div>
        </template>
        <a
          v-else
          :href="slide.href"
          target="_blank"
          rel="noreferrer noopener"
          class="picture"
        >
          <picture>
            <img :src="slide.image" alt="slide.name" />
          </picture>
          <h4>{{ slide.name }}</h4>
        </a>
      </div>
    </div>
    <button
      v-if="isMultipleSlides"
      class="swiper-button-nav swiper-button-nav--prev swiper-nav swiper-nav--left"
      @click="handleClickPrev"
    >
      <span />
    </button>
    <button
      v-if="isMultipleSlides"
      class="swiper-button-nav swiper-button-nav--next swiper-nav swiper-nav--right"
      @click="handleClickNext"
    >
      <span />
    </button>
    <div class="swiper-pagination" />
  </div>
</template>

<script>
// There is a issue about autoplay not working with nuxt
// https://github.com/surmon-china/vue-awesome-swiper/issues/688#issuecomment-660924010
import {
  Swiper as SwiperClass,
  Autoplay,
  Pagination,
  Navigation,
} from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
SwiperClass.use([Autoplay, Pagination, Navigation])
const { directive } = getAwesomeSwiper(SwiperClass)

export default {
  components: {
    YoutubeEmbedByIframeApi,
  },
  directives: {
    swiper: directive,
  },
  props: {
    slideshow: {
      type: Array,
      required: true,
      default: () => [],
    },
    multivideo: {
      type: Array,
      required: true,
      default: () => [],
    },
    isVideo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      prevIndex: 0,
    }
  },
  computed: {
    slidesData() {
      const data = this.isVideo ? this.multivideo : this.slideshow
      return data.map((post) => {
        const { id = '', href = '', name = '', image = '', youtubeId = '' } =
          post || {}

        return { id, href, name, image, youtubeId }
      })
    },
    isMultipleSlides() {
      return this.slidesData.length > 1
    },
    swiperOptionAutoplay() {
      if (!this.isVideo && this.isMultipleSlides) {
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
        slidesPerGroup: 1,
        spaceBetween: 0,
        centeredSlides: true,
        autoplay: this.swiperOptionAutoplay,
        disableOnInteraction: !this.isVideo,
        pagination: {
          el: '.swiper-pagination',
          bulletClass: 'my-bullet',
          bulletActiveClass: 'my-bullet-active',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-nav--next',
          prevEl: '.swiper-button-nav--prev',
        },
        // onSlideChangeStart: () => this.onActiveIndex(),
      }
    },
  },
  mounted() {
    if (this.isVideo) {
      this.mySwiper.on('slideChangeStart', () => this.onActiveIndex())
      this.mySwiper.on('transitionStart', () => this.onActiveIndex())
    }
  },
  methods: {
    handleClickPrev() {
      this.mySwiper.slidePrev()
    },
    handleClickNext() {
      this.mySwiper.slideNext()
    },
    onActiveIndex() {
      let i = this.mySwiper.activeIndex
      let slideToIndex = 0

      if (i === 0) {
        this.prevIndex = 1
        slideToIndex = this.slidesData.length
      } else if (i === this.slidesData.length + 1) {
        this.prevIndex = this.slidesData.length
        slideToIndex = 1
      }

      if (slideToIndex) {
        i = slideToIndex
        this.updateLoop()
      }

      const prevVideoPlayer = this.$refs[`video-${this.prevIndex - 1}`]?.[0]
        ?.player
      const currentVideoPlayer = this.$refs[`video-${i - 1}`]?.[0]?.player
      prevVideoPlayer?.pauseVideo()
      this.prevIndex = i
      currentVideoPlayer?.mute()
      currentVideoPlayer?.playVideo()
    },
    // fix the looping problem when going through first to last item
    // see related issue: https://github.com/surmon-china/vue-awesome-swiper/issues/397
    updateLoop() {
      if (this.mySwiper) {
        this.$nextTick(() => {
          this.mySwiper.loopDestroy()
          this.mySwiper.loopCreate()
          // this.onActiveIndex()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'swiper/swiper-bundle.css';

.swiper {
  position: relative;
  max-width: calc(264px + 60px);
  overflow: hidden;
  @include media-breakpoint-up(xl) {
    max-width: calc(662px + 60px);
  }
}

.swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 12px 0;
  @include media-breakpoint-up(md) {
    padding: 4px 30px 0;
  }
  .video {
    display: block;
    width: 100%;
    margin: 0 0 30px;
  }
  .picture {
    display: block;
    width: 100%;
    position: relative;
    picture {
      display: block;
      position: relative;
      width: 100%;
      padding-top: calc((100% - 60px) * 0.66);
      margin: 0 0 30px;
      overflow: hidden;
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
    h4 {
      position: absolute;
      bottom: calc(12px + 30px);
      left: 25px;
      right: 25px;
      font-size: 14px;
      line-height: 1.5;
      text-align: justify;
      color: #f4f5f7;
      @include media-breakpoint-up(md) {
        bottom: calc(8px + 30px);
        left: 8px;
        right: 8px;
      }
      @include media-breakpoint-up(xl) {
        bottom: calc(20px + 30px);
        left: 16px;
        right: 16px;
        font-size: 30px;
        font-weight: 500;
        line-height: 42px;
      }
    }
  }
}

.swiper-nav {
  position: absolute;
  top: 50%;
  z-index: 1000;
  transform: translate(0, -50%);
  outline: none;
  &--left {
    @include media-breakpoint-up(md) {
      left: 0;
      right: auto;
    }
  }
  &--right {
    @include media-breakpoint-up(md) {
      right: 0;
      left: auto;
    }
  }
}

.swiper-button-nav {
  display: none;
  padding: 10px;
  cursor: pointer;
  @include media-breakpoint-up(md) {
    display: block;
  }
  span {
    display: block;
    width: 12px;
    height: 12px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg);
    outline: none;
  }
  &--next {
    span {
      transform: rotate(-135deg);
    }
  }
}

.swiper-container-horizontal > .swiper-pagination-bullets {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.swiper-pagination {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  ::v-deep {
    .my-bullet {
      width: 12px;
      height: 12px;
      display: inline-block;
      border-radius: 50%;
      background-color: #e7e7e7;
      cursor: pointer;
      & + .my-bullet {
        margin: 0 0 0 12px;
      }
    }
    .my-bullet-active {
      background-color: #ffcc01;
    }
  }
}
</style>
