<template>
  <div class="show-card">
    <a class="show-card__banner" :href="`/show/${show.slug}`">
      <img :src="getBannerImgUrl" :alt="show.slug" />
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
      return this.show.bannerImg?.urlOriginal
    },
  },
}
</script>

<style lang="scss" scoped>
.show-card {
  position: relative;
  width: 100%;
  padding-top: 37.5%;
  margin-bottom: 20px;
  cursor: pointer;

  &__banner {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
