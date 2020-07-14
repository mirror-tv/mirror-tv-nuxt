<template functional>
  <div class="h1-bordered-wrapper">
    <h1 v-text="props.text" />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.h1-bordered-wrapper {
  display: inline-block;
  padding: 2px 10px;
  border: 3px solid;
  border-image: linear-gradient(
      to bottom,
      #014db8 35%,
      white 35%,
      white 65%,
      #014db8 65%
    )
    5;
  h1 {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.5px;
    color: #014db8;
  }
}
</style>
