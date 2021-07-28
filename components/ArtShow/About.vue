<template>
  <section class="artshow__about">
    <main class="main">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="artshow__about__introduction" v-html="introduction" />
    </main>
    <aside class="g-aside">
      <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
    </aside>
    <section class="artshow__about__collect">
      <template v-if="isMobile">
        <h3>未來一週預告</h3>
        <ol>
          <li v-for="item in trailerList.items" :key="item.id">
            <YoutubeEmbedByIframeApi :videoId="item.id" />
            <h4 v-text="item.title" />
          </li>
          <div class="position-correct" />
        </ol>
        <h3>所有影片</h3>
        <VideoListSlides
          :currentShow="currentShow"
          :items="showList"
          class="slide"
        />
      </template>
      <template v-else>
        <h3>未來一週預告</h3>
        <VideoListSlides :items="trailerList.items" class="slide" />
        <h3>所有影片</h3>
        <ol>
          <li v-for="item in showList" :key="item.id">
            <a
              :href="`/show/${currentShow}/${item.id}`"
              rel="noreferer noopener"
            >
              <img src="~assets/img/image-default.png" :alt="item.title" />
            </a>
            <h4 v-text="item.title" />
          </li>
          <div class="position-correct" />
        </ol>
        <ButtonLoadmore class="g-button-load-more" />
      </template>
    </section>
  </section>
</template>

<script>
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import VideoListSlides from '~/components/VideoListSlides'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import ButtonLoadmore from '~/components/ButtonLoadmore'

export default {
  components: {
    FacebookPagePlugin,
    VideoListSlides,
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    introduction: {
      type: String,
      required: true,
    },
    facebookUrl: {
      type: String,
      required: true,
    },
    trailerList: {
      type: Object,
      default: () => {},
      required: true,
    },
    showList: {
      type: Array,
      default: () => [],
      required: true,
    },
    currentShow: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow {
  &__about {
    .main {
      margin: 24px auto 0;
      @include media-breakpoint-up(md) {
        margin: 28px 0 0;
      }
      @include media-breakpoint-up(xl) {
        margin-bottom: 34px;
        width: 600px;
      }
    }
    .g-aside {
      width: 100%;
      margin: 48px auto 0;
      @include media-breakpoint-up(md) {
        width: 320px;
        padding: 0;
        margin: 28px 0 0 auto;
      }
      @include media-breakpoint-up(xl) {
        width: 320px;
        padding: 0;
      }
    }
    &__introduction {
      text-align: justify;
      color: $color-blue;
      font-weight: 500;
      font-size: 16px;
      line-height: 32px;
    }
    &__collect {
      margin-top: 12px;
      .slide {
        margin-bottom: 28px;
        @include media-breakpoint-up(md) {
          margin-bottom: 48px;
        }
        @include media-breakpoint-up(md) {
          margin-bottom: 80px;
        }
      }
      h3 {
        color: $color-blue;
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0.5px;
        margin-bottom: 23px;
        @include media-breakpoint-up(md) {
          margin-bottom: 40px;
        }
      }
      ol {
        @include media-breakpoint-up(md) {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          &::after {
            content: '';
            width: calc((100% - 64px) / 3);
          }
        }
        @include media-breakpoint-up(xl) {
          &::after {
            content: '';
            width: calc((100% - 96px) / 4);
          }
          .position-correct {
            width: calc((100% - 96px) / 4);
            overflow: hidden;
          }
        }
        @include media-breakpoint-up(xxl) {
          &::after {
            content: '';
            width: calc((100% - 48px) / 4);
          }
          .position-correct {
            width: calc((100% - 48px) / 4);
            overflow: hidden;
          }
        }
        li {
          margin-bottom: 24px;
          @include media-breakpoint-up(md) {
            width: calc((100% - 64px) / 3);
          }
          @include media-breakpoint-up(xl) {
            width: calc((100% - 96px) / 4);
          }
          h4 {
            font-size: 16px;
            font-weight: 400;
            line-height: 23px;
            margin-top: 12px;
          }
          a {
            display: block;
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background-color: $color-grey;
            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center center;
            }
          }
        }
      }
      .g-button-load-more {
        @include media-breakpoint-up(md) {
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
