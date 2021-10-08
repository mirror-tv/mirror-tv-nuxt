<template>
  <div class="promotion">
    <HeadingBordered class="heading" :text="title" />
    <ClientOnly>
      <YoutubeEmbedByIframeApi
        v-for="item in promotionVideoIds"
        :key="item"
        :videoId="item"
        class="promotion__item"
      />
    </ClientOnly>
  </div>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'

export default {
  components: {
    HeadingBordered,
    YoutubeEmbedByIframeApi,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    promotionVideoIds: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.promotion {
  .heading {
    margin: 0 0 20px;
    min-width: 110px;
  }
  &__item {
    width: 100%;
    @include media-breakpoint-up(xl) {
      width: calc(100% + 2px);
      transform: translateX(-1px);
    }
  }
  &__item + &__item {
    margin: 16px 0 0;
    @include media-breakpoint-up(md) {
      margin: 20px 0 0;
    }
  }
}
</style>
