<template>
  <div class="show-card">
    <a class="show-card__banner" :href="handleShowSlug(show.slug)">
      <img v-if="getBannerImgUrl" :src="getBannerImgUrl" :alt="show.slug" />
      <img v-else src="~assets/img/image-default.jpg" alt="default banner" />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Object,
      required: true,
    },
  },
  computed: {
    getBannerImgUrl() {
      return (
        this.show.bannerImage?.urlDesktopSized ||
        this.show.bannerImg?.urlOriginal
      )
    },
  },
  methods: {
    handleShowSlug(slug) {
      return slug === 'art' || slug === 'doc'
        ? `/show/${slug}/main`
        : `/show/${slug}`
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
    }
  }
}
</style>
