<template>
  <div class="image">
    <img v-lazy="image.url" :alt="image.name" />
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
  img {
    width: 100%;
  }
}
</style>
