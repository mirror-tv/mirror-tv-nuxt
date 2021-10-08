<template>
  <div class="social-list">
    <h4>追蹤我們</h4>
    <div class="social-list__list">
      <FacebookPagePlugin
        class="fb"
        href="https://www.facebook.com/readr.tw/"
      />
      <ul>
        <li v-for="item in listData" :key="item.href">
          <a :href="item.href" target="_blank" rel="noreferrer noopener">
            <img v-lazy="item.image" :alt="item.text" />
            <span>{{ item.text }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import FacebookPagePlugin from '~/components/FacebookPagePlugin'

export default {
  components: {
    FacebookPagePlugin,
  },
  data() {
    return {
      listData: [
        {
          href: 'https://www.youtube.com/channel/UC4LjkybVKXCDlneVXlKAbmw',
          image: require('~/assets/img/icon/yt-rgb-square.svg'),
          text: '訂閱',
        },
        {
          href: 'https://www.instagram.com/mnewstw/',
          image: require('~/assets/img/social-media/ig-rgb.svg'),
          text: '追蹤',
        },
        {
          href: 'https://lin.ee/4XsO8xi',
          image: require('~/assets/img/social-media/line-rgb-square.svg'),
          text: '好友',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.social-list {
  h4 {
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    color: $color-blue;
    margin: 0 0 12px;
  }
  &__list {
    width: 200px;
    @include media-breakpoint-up(md) {
      width: auto;
      display: flex;
      align-items: center;
    }
    .fb {
      width: 100%;
      height: 90px;
      margin: 0 0 16px;
      @include media-breakpoint-up(md) {
        max-width: 220px;
        margin: 0 24px 0 0;
      }
    }
    ul {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include media-breakpoint-up(md) {
        width: 170px;
      }
      li {
        width: 46px;
        img {
          width: 46px;
          height: 46px;
          margin: 0 0 8px;
        }
        span {
          width: 100%;
          display: block;
          font-size: 16px;
          font-weight: 500;
          line-height: 28px;
          color: $color-blue;
          text-align: center;
        }
      }
    }
  }
}
</style>
