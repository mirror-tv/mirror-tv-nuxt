<template>
  <div class="link-list">
    <div class="link-list__wrapper">
      <LinkAnchorStyle />
      <LinkYoutubeStyle />
      <FacebookPagePlugin :href="fbHref" />
    </div>
  </div>
</template>

<script>
import LinkAnchorStyle from '~/components/LinkAnchorStyle'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'

export default {
  components: {
    LinkAnchorStyle,
    LinkYoutubeStyle,
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
