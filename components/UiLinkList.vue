<template>
  <div class="link-list">
    <div class="link-list__wrapper">
      <UiAsideLink
        href="/anchorperson"
        :leftIcon="require('~/assets/img/icon/yt-black.svg')"
        :rightIcon="require('~/assets/img/icon/microphone.svg')"
        leftText="鏡主播"
        rightText="追蹤"
        themeColor="rgb(28, 178, 230)"
      />
      <UiAsideLink
        href="https://www.youtube.com/channel/UC4LjkybVKXCDlneVXlKAbmw"
        :leftIcon="require('@/assets/img/icon/yt-rgb.png')"
        :rightIcon="require('~/assets/img/icon/subscription.svg')"
        leftText="鏡新聞"
        rightText="訂閱"
        themeColor="#f00"
      />
      <UiAsideLink
        href="https://lin.ee/4XsO8xi"
        :leftIcon="require('~/assets/img/social-media/line-rgb.svg')"
        leftText="LINE"
        rightText="加入好友"
        themeColor="#06c755"
      />
      <FacebookPagePlugin :href="fbHref" />
    </div>
  </div>
</template>

<script>
import UiAsideLink from '~/components/UiAsideLink'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'

export default {
  components: {
    UiAsideLink,
    FacebookPagePlugin,
  },
  props: {
    fbHref: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.link-list {
  margin: 0 0 8px;
  &__wrapper {
    @include media-breakpoint-up(md) {
      width: 336px;
    }
    @include media-breakpoint-up(xl) {
      width: 100%;
    }
  }
}
</style>
