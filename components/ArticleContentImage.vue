<template>
  <div class="image">
    <div class="image__image">
      <img v-lazy="image.url" :alt="image.name" />
    </div>

    <div class="image__info">{{ image.title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.image {
  width: 100%;
  &__image {
    width: auto;
    height: auto;
    @include media-breakpoint-up(md) {
      max-width: 100%;
      max-height: 100vh;
    }
    img {
      width: 100%;
      height: 100%;
      @include media-breakpoint-up(md) {
        width: auto;
        max-width: 100%;
        max-height: 100vh;
        min-height: 400px;
        margin-right: auto;
        margin-left: auto;
      }
    }
  }

  &__info {
    margin-top: 8px;
    width: 100%;
    height: 30px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 20px;
    text-align: left;
    color: #4a4a4a;
  }
}
</style>
