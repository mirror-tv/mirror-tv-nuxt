<template>
  <button>看更多</button>
</template>

<style lang="scss" scoped>
button {
  padding: 4px 0;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
  text-align: center;
  line-height: 28px;
  color: $color-blue;
  border: solid 3px $color-blue;
  outline: none;
  &:hover {
    background-color: rgba(0, 77, 188, 0.05);
  }
  &:active {
    background-color: rgba(0, 77, 188, 0.15);
  }
}
</style>
