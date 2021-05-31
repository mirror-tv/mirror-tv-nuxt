<template>
  <div class="g-page ombuds">
    <section class="ombuds__banner">
      <img src="~assets/img/ombuds-banner.jpg" alt="ombudsman banner" />
    </section>
    <div class="ombuds__content">
      <h2>公評人</h2>
      <section class="ombuds__intro__wrapper">
        <main class="ombuds__intro__main">
          <div class="ombuds__intro__main__wrapper">
            <div class="ombuds__intro__main__wrapper-img">
              <img src="~assets/img/image-default.png" alt="ombudsman banner" />
            </div>
            <div class="ombuds__intro__main__wrapper-info">
              <h3>公評人簡介</h3>
              <p>{{ ombudsIntroduction }}</p>
              <a
                href="/story/biography"
                target="_blank"
                rel="noreferrer noopener"
                class="ombuds__intro__main__wrapper-info--btn"
                @click="sendGaClickEvent('了解更多')"
              >
                了解更多
              </a>
            </div>
          </div>
        </main>
        <aside class="ombuds__intro__aside">
          <div class="ombuds__intro__aside-text">
            <h3>新聞申訴方式</h3>
            <p>若您對弊社的新聞品質與內容有意見或ooxxvvwwzz</p>
          </div>
          <div class="ombuds__intro__aside-btn">
            <a
              href="/story/complaint"
              target="_blank"
              rel="noreferrer noopener"
              class="ombuds__intro__aside-btn--btn1"
              @click="sendGaClickEvent('我要申訴')"
            >
              我要申訴
            </a>
            <a
              href="/story/complaint"
              target="_blank"
              rel="noreferrer noopener"
              class="ombuds__intro__aside-btn--btn2"
              @click="sendGaClickEvent('如何申訴')"
            >
              如何申訴？
            </a>
          </div>
        </aside>
      </section>
      <ol class="ombuds__infolist">
        <li
          v-for="info in infoList"
          :key="info.id"
          class="ombuds__infolist__item"
        >
          <a
            :href="info.herf"
            target="_blank"
            rel="noreferrer noopener"
            @click="sendGaClickEvent(info.ga)"
          >
            <div class="ombuds__infolist__item-icon">
              <img :src="info.img" :alt="info.title" />
            </div>
            <div class="ombuds__infolist__item-title">
              <p>{{ info.t1 }}</p>
              <p>{{ info.t2 }}</p>
            </div>
          </a>
        </li>
        <div class="position-correct" />
      </ol>
    </div>
  </div>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { fetchPostPublishedBySlug } from '~/apollo/queries/post.gql'

export default {
  apollo: {
    postPublished: {
      query: fetchPostPublishedBySlug,
      variables() {
        return {
          slug: 'biography',
        }
      },
      update: (data) => data.postPublished?.[0],
    },
  },
  data() {
    return {
      infoList: [
        {
          img: require('~/assets/img/ombuds/icon-p1.svg'),
          t1: '關於鏡電視',
          t2: '公評人',
          herf: '/story/biography',
          ga: '關於鏡電視公評人',
        },
        {
          img: require('~/assets/img/ombuds/icon-p2.svg'),
          t1: '申訴',
          t2: '流程',
          herf: '/story/complaint',
          ga: '申訴流程',
        },
        {
          img: require('~/assets/img/ombuds/icon-p3.svg'),
          t1: '新聞製作',
          t2: '準則',
          herf: '/story/standards',
          ga: '新聞製作準則',
        },
        {
          img: require('~/assets/img/ombuds/icon-p4.svg'),
          t1: '影音',
          t2: '紀錄',
          herf: '/ombuds/archive',
          ga: '影音紀錄',
        },
        {
          img: require('~/assets/img/ombuds/icon-p5.svg'),
          t1: '常見問題',
          t2: 'FAQ',
          herf: '/story/faq',
          ga: '常見問題FAQ',
        },
        {
          img: require('~/assets/img/ombuds/icon-p7.svg'),
          t1: '聯絡',
          t2: '我們',
          herf: 'mailto:ombuds@mnews.tw',
          ga: '聯絡我們',
        },
      ],
    }
  },
  head() {
    const title = `公評人專區 - ${SITE_NAME}`
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getDomain()}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    ombudsIntroduction() {
      try {
        const content = JSON.parse(this.postPublished?.contentApiData)
        return content?.[0].content?.[0]
          ? content?.[0].content?.[0].slice(0, 150).concat('...')
          : ''
      } catch {
        return ''
      }
    },
  },
  methods: {
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ombuds')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page {
  @include media-breakpoint-up(md) {
    padding-top: 0;
  }
}
.ombuds {
  width: 100%;
  &__banner {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    height: 100vw * 0.25;
    transform: translateX(-16px);
    margin-bottom: 24px;
    @include media-breakpoint-up(md) {
      width: 100%;
      transform: none;
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
      object-position: center;
      @include media-breakpoint-up(md) {
        top: -2px; // 為了覆蓋 header 下方的空白
      }
    }
  }
  &__content {
    margin: 0 auto;
    @include media-breakpoint-up(md) {
      width: 696px;
    }
    @include media-breakpoint-up(xl) {
      width: 1120px;
    }
    h2 {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: $color-blue;
      margin-bottom: 12px;
      @include media-breakpoint-up(md) {
        font-size: 30px;
        line-height: 42px;
        margin-bottom: 24px;
      }
    }
  }
  &__intro {
    &__wrapper {
      margin: 0 0 32px;
      @include media-breakpoint-up(xl) {
        display: flex;
        justify-content: space-between;
        margin: 0 0 48px;
      }
    }
    &__main {
      margin-bottom: 24px;
      @include media-breakpoint-up(xl) {
        width: 806px;
      }
      &__wrapper {
        padding: 0 16px;
        @include media-breakpoint-up(md) {
          display: flex;
          padding: 0;
        }
        &-img {
          position: relative;
          display: block;
          width: calc(100% + 64px);
          height: calc(100vw * 0.63);
          transform: translateX(-32px);
          margin-bottom: 24px;
          @include media-breakpoint-up(md) {
            margin: 0 24px 0 0;
            min-width: 384px;
            height: 216px;
            transform: none;
            margin-bottom: 0;
          }
          @include media-breakpoint-up(xl) {
            min-width: 480px;
            height: 270px;
            margin: 0 32px 0 0;
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
            object-position: center;
            background-color: $color-grey;
          }
        }
        &-info {
          h3 {
            font-size: 18px;
            font-weight: 500;
            line-height: 25px;
            color: $color-blue;
            margin-bottom: 8px;
            @include media-breakpoint-up(md) {
              font-weight: 500;
              font-size: 20px;
              line-height: 1.6;
              letter-spacing: 0.5px;
            }
          }
          p {
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 8px;
            word-wrap: break-word;
            word-break: break-all;
            -webkit-line-clamp: 5;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          &--btn {
            position: relative;
            font-weight: 600;
            font-size: 16px;
            line-height: 28px;
            margin-left: calc(100% - 75px);
            &::before {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              right: -12px;
              height: 1px;
              background-color: #000;
            }
            &::after {
              content: '';
              position: absolute;
              top: 20%;
              border: solid black;
              border-width: 0 2px 2px 0;
              display: inline-block;
              padding: 4px;
              transform: rotate(-45deg);
            }
          }
        }
      }
    }
    &__aside {
      text-align: center;
      background-color: #f4f5f6;
      padding: 20px 16px;
      @include media-breakpoint-up(xl) {
        width: 207px;
        display: block;
      }
      &-text {
        h3 {
          color: $color-blue-deep;
          font-size: 18px;
          font-weight: 500;
          line-height: 25px;
          margin-bottom: 12px;
          @include media-breakpoint-up(md) {
            font-size: 20px;
            line-height: 1.6;
            letter-spacing: 0.5px;
          }
        }
        p {
          font-size: 16px;
          line-height: 1.8;
          text-align: left;
          margin-bottom: 12px;
          @include media-breakpoint-up(md) {
            text-align: center;
          }
          @include media-breakpoint-up(xl) {
            text-align: left;
          }
        }
      }
      &-btn {
        @include media-breakpoint-up(md) {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        @include media-breakpoint-up(xl) {
          display: block;
          width: 100%;
          font-size: 20px;
          line-height: 28px;
          margin: 18px 0 0;
        }
        &--btn1 {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 3px;
          line-height: 28px;
          color: $color-blue;
          border: 1px solid $color-blue;
          background-color: #fff;
          padding: 8px 0;
          margin: 0 0 8px 0;
          @include media-breakpoint-up(md) {
            width: 140px;
            margin: 0 8px 0 0;
          }
          @include media-breakpoint-up(xl) {
            width: 100%;
            margin: 0 0 8px 0;
          }
          &:hover {
            padding: 7px 0;
            border: 2px solid $color-blue;
          }
          &:active {
            padding: 7px 0;
            border: 2px solid $color-blue;
            background-color: rgba(0, 77, 188, 0.05);
          }
        }
        &--btn2 {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: 500;
          letter-spacing: 3px;
          line-height: 28px;
          color: #4a4a4a;
          border: 1px solid #d8d8d8;
          background-color: #fff;
          padding: 8px 0;
          @include media-breakpoint-up(md) {
            width: 140px;
          }
          @include media-breakpoint-up(xl) {
            width: 100%;
          }
          &:hover {
            padding: 7px 0;
            border: 2px solid #4a4a4a;
          }
          &:active {
            padding: 7px 0;
            border: 2px solid #4a4a4a;
            background-color: rgba(155, 155, 155, 0.05);
          }
        }
      }
    }
  }
  &__infolist {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @include media-breakpoint-up(md) {
      &::after {
        content: '';
        width: calc((100% - 48px) / 4);
      }
    }
    &__item {
      width: calc((100% - 8px) / 2);
      margin-bottom: 12px;
      @include media-breakpoint-up(md) {
        width: calc((100% - 48px) / 4);
        margin-bottom: 16px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - (16px * 5)) / 6);
        margin-bottom: 20px;
      }
      &-icon {
        background-color: $color-blue-deep;
        padding: 8px 0;
        img {
          width: 22px;
          height: 22px;
          margin: 0 auto;
        }
      }
      &-title {
        padding: 8px;
        background-color: $color-grey;
        text-align: center;
        p {
          color: $color-blue-deep;
          font-weight: 500;
          font-size: 18px;
          line-height: 25px;
        }
      }
    }
    .position-correct {
      width: calc((100% - 8px) / 2);
      overflow: hidden;
      @include media-breakpoint-up(md) {
        width: calc((100% - 48px) / 4);
      }
      @include media-breakpoint-up(xl) {
        display: none;
      }
    }
  }
}
</style>
