<template>
  <div class="heading-bordered-wrapper">
    <span v-text="text" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.heading-bordered-wrapper {
  display: inline-block;
  padding: 2px 10px;
  border: 3px solid;
  border-image: linear-gradient(
      to bottom,
      $color-blue 35%,
      transparent 35%,
      transparent 65%,
      $color-blue 65%
    )
    5;
  span {
    display: block;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: $color-blue;
    text-align: center;
  }
}
</style>
