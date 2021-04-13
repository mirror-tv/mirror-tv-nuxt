<template>
  <div class="g-page ombuds">
    <section class="ombuds__banner">
      <img src="~assets/img/image-default.png" alt="ombudsman banner" />
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
              <p>
                話須說陸日別，無相可前人過會自動此以水年美調化為不全年加它聽人室
                入樂賽日，不實之。已主如真平心生是，候大德數畫車一當；黑長時他以
                型裡速經足起百母代！由下提位會看。關
              </p>
              <button>了解更多</button>
            </div>
          </div>
        </main>
        <aside class="ombuds__intro__aside">
          <h3>新聞申訴方式</h3>
          <p>若您對弊社的新聞品質與內容有意見或ooxxvvwwzz</p>
          <button>我要申訴</button>
        </aside>
      </section>
      <ol class="ombuds__infolist">
        <li
          v-for="info in infoList"
          :key="info.id"
          class="ombuds__infolist__item"
        >
          <a :href="info.herf" target="_blank" rel="noreferrer noopener">
            <div class="ombuds__infolist__item-icon">
              <img :src="info.img" :alt="info.title" />
            </div>
            <div class="ombuds__infolist__item-title">
              <p>{{ info.t1 }}</p>
              <p>{{ info.t2 }}</p>
            </div>
          </a>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoList: [
        {
          img: require('~/assets/img/ombuds/icon-p1.svg'),
          t1: '關於鏡電視',
          t2: '公評人',
          herf: '/story/biography',
        },
        {
          img: require('~/assets/img/ombuds/icon-p2.svg'),
          t1: '申訴',
          t2: '流程',
          herf: '/story/complaint',
        },
        {
          img: require('~/assets/img/ombuds/icon-p3.svg'),
          t1: '新聞製作',
          t2: '準則',
          herf: '/story/standards',
        },
        {
          img: require('~/assets/img/ombuds/icon-p4.svg'),
          t1: '影音',
          t2: '紀錄',
          herf: '/ombuds/archive',
        },
        {
          img: require('~/assets/img/ombuds/icon-p5.svg'),
          t1: '常見問題',
          t2: 'FAQ',
          herf: '/story/faq',
        },
        {
          img: require('~/assets/img/ombuds/icon-p6.svg'),
          t1: '季報',
          t2: '年報',
          herf: 't0001',
        },
        {
          img: require('~/assets/img/ombuds/icon-p7.svg'),
          t1: '聯絡',
          t2: '我們',
          herf: 'mailto:ombuds@mnews.tw',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.g {
  &-page {
    padding-top: 50px;
    @include media-breakpoint-up(sm) {
      padding-top: 0;
    }
  }
}
.ombuds {
  width: 100%;
  &__banner {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    height: calc(100vw * 0.42);
    transform: translateX(-16px);
    margin-bottom: 28px;
    @include media-breakpoint-up(md) {
      width: calc(100% + 80px);
      max-height: 260px;
      transform: translateX(-40px);
      margin-bottom: 60px;
    }
    @include media-breakpoint-up(xl) {
      max-height: 320px;
      margin-bottom: 90px;
    }
    @include media-breakpoint-up(xxl) {
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
      background-color: $color-grey;
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
      line-height: 23px;
      color: $color-blue-deep;
      margin-bottom: 12px;
      @include media-breakpoint-up(md) {
        font-size: 30px;
        line-height: 35px;
      }
    }
  }
  &__intro {
    &__wrapper {
      margin-bottom: 28px;
      @include media-breakpoint-up(xl) {
        display: flex;
        justify-content: space-between;
      }
    }
    &__main {
      margin-bottom: 28px;
      @include media-breakpoint-up(md) {
        margin-bottom: 40px;
      }
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
          margin-bottom: 27px;
          @include media-breakpoint-up(md) {
            margin-right: 15px;
            width: 220%;
            height: auto;
            transform: none;
            margin-bottom: 0;
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
            font-size: 20px;
            font-weight: 600;
            line-height: 32px;
            letter-spacing: 0.5px;
            color: $color-blue-deep;
            margin-bottom: 6px;
            @include media-breakpoint-up(md) {
              font-size: 24px;
              margin-bottom: 16px;
            }
            @include media-breakpoint-up(xl) {
              margin-bottom: 49px;
            }
          }
          p {
            font-size: 13px;
            font-weight: 500;
            line-height: 28px;
            color: $color-blue-deep;
            margin-bottom: 28px;
            @include media-breakpoint-up(md) {
              font-size: 16px;
              margin-bottom: 12px;
            }
            @include media-breakpoint-up(xl) {
              margin-bottom: 28px;
            }
          }
          button {
            width: 100%;
            color: #ffcc01;
            background-color: $color-blue-deep;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            letter-spacing: 0.5px;
            padding: 15px 0;
            @include media-breakpoint-up(md) {
              padding: 10px 0;
            }
          }
        }
      }
    }
    &__aside {
      width: calc(100% + 32px);
      transform: translateX(-16px);
      padding: 20px 56px;
      text-align: center;
      background-color: #444746;
      @include media-breakpoint-up(md) {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0 0 18px;
        transform: none;
      }
      @include media-breakpoint-up(xl) {
        width: 220px;
        display: block;
        padding: 24px 0 0;
        margin-bottom: auto;
      }
      h3 {
        color: #ffcc01;
        font-size: 20px;
        font-weight: 400;
        line-height: 32px;
        letter-spacing: 0.5px;
        margin-bottom: 23px;
        @include media-breakpoint-up(md) {
          font-size: 24px;
          margin: 0 7px 0 0;
        }
        @include media-breakpoint-up(xl) {
          margin: 0 0 23px 0;
        }
      }
      p {
        color: #fff;
        font-weight: 500;
        font-size: 13px;
        line-height: 28px;
        text-align: left;
        margin-bottom: 23px;
        padding: 0 10px;
        @include media-breakpoint-up(md) {
          font-size: 16px;
          margin: 0;
        }
        @include media-breakpoint-up(xl) {
          margin-bottom: 25px;
          padding: 0 14px;
        }
      }
      button {
        width: 100%;
        color: $color-blue-deep;
        background-color: #ffcc01;
        font-weight: 600;
        font-size: 20px;
        line-height: 28px;
        letter-spacing: 0.5px;
        padding: 12px 0;
        @include media-breakpoint-up(md) {
          width: 107px;
          margin-left: auto;
        }
        @include media-breakpoint-up(xl) {
          width: 100%;
          margin-left: auto;
          padding: 7px 0;
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
        width: calc((100% - (36px * 3)) / 4);
      }
    }
    &__item {
      width: calc((100% - 9px) / 2);
      margin-bottom: 13px;
      @include media-breakpoint-up(md) {
        width: calc((100% - (36px * 3)) / 4);
        margin-bottom: 20px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - (16px * 6)) / 7);
        margin-bottom: 20px;
      }
      &-icon {
        background-color: $color-blue-deep;
        padding: 9px 0;
        img {
          width: 22px;
          height: 22px;
          margin: 0 auto;
        }
      }
      &-title {
        padding: 9px;
        background-color: $color-grey;
        text-align: center;
        p {
          color: $color-blue-deep;
          font-weight: 600;
          font-size: 18px;
          line-height: 25px;
        }
      }
    }
  }
}
</style>
