<template>
  <button>看更多</button>
</template>

<script>
export default {
  // for setting intersection-observer in index page
  mounted() {
    this.$emit('button-mounted')
  },
}
</script>

<style lang="scss" scoped>
button {
  padding: 8px 0;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
  text-align: center;
  line-height: 28px;
  color: $color-blue;
  border: 1px solid $color-blue;
  outline: none;
  &:hover {
    padding: 7px 0;
    border: 2px solid $color-blue;
  }
  &:active {
    padding: 7px 0;
    border: 2px solid $color-blue;
    background-color: rgba(0, 77, 188, 0.05);
  }
}
</style>
