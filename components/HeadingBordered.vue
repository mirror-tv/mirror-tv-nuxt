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
      #014db8 35%,
      transparent 35%,
      transparent 65%,
      #014db8 65%
    )
    5;
  span {
    display: block;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: #014db8;
    text-align: center;
  }
}
</style>
