<template>
  <div class="error">
    <template v-if="error.statusCode === 500">
      <div class="container">
        <h1 class="error__heading">50</h1>
        <p>這個網頁無法正常運作</p>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  layout: 'empty',
}
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
  background-color: #003365;
  @include media-breakpoint-up(md) {
    font-size: 30px;
  }
  .container {
    position: relative;
    transform: translate(-20px, -100%);
    @include media-breakpoint-up(md) {
      transform: translate(-20%, -50%);
    }
    @include media-breakpoint-up(xl) {
      transform: translate(-50%, -50%);
    }
  }
  &__heading {
    position: relative;
    font-size: 50px;
    text-align: right;
    line-height: 1;
    transform: translateX(5px);
    @include media-breakpoint-up(md) {
      font-size: 200px;
      transform: translateX(10px);
    }
    &::after {
      content: '0';
      position: absolute;
      right: 0;
      bottom: 0;
      transform: translate(calc(100%), 50%) rotate(25deg);
      @include media-breakpoint-up(md) {
        transform: translate(calc(100% + 10px), 25%) rotate(25deg);
      }
    }
  }
}
</style>
