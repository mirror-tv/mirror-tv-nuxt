<template>
  <div class="show-card">
    <a class="show-card__banner" :href="href">
      <img v-if="showBannerUrl" v-lazy="showBannerUrl" :alt="slug" />
    </a>
  </div>
</template>

<script>
import { getBannerImageUrl } from '~/utils/image-handler'

export default {
  props: {
    show: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  computed: {
    slug() {
      return this.show?.slug ?? ''
    },
    href() {
      return this.slug === 'art' || this.slug === 'doc'
        ? `/show/${this.slug}/main`
        : `/show/${this.slug}`
    },
    showBannerUrl() {
      return getBannerImageUrl(this.show) ?? ''
    },
  },
}
</script>

<style lang="scss" scoped>
.show-card {
  position: relative;
  width: 100%;
  padding-top: 37.5%;
  margin-bottom: 16px;
  cursor: pointer;

  // tablet range
  @include media-breakpoint-up(md) {
    width: calc((100% - 20px) / 2);
    padding-top: 18.75%;
  }

  // desktop range
  @include media-breakpoint-up(xl) {
    width: 100%;
    padding-top: 37.5%;
  }

  &__banner {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    // tablet range
    @include media-breakpoint-up(md) {
      max-width: 336px;
      max-height: 126px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: -webkit-optimize-contrast; // 避免 chrome 圖片模糊問題
    }
  }
}
</style>
