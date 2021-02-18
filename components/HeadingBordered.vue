<template>
  <div :class="{ icon: showIcon }" class="heading-bordered-wrapper">
    <span v-text="text" />
  </div>
</template>

<script>
export default {
  props: {
    showIcon: {
      type: Boolean,
      default: false,
    },
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
  &.icon {
    position: relative;
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 50%;
    }
    &::before {
      left: calc(100% + 12px);
      width: 20px;
      height: 20px;
      box-shadow: inset 0 0 0 2px #fc0;
    }
    &::after {
      left: calc(100% + 17px);
      width: 10px;
      height: 10px;
      background-color: #fc0;
    }
  }
}
</style>
