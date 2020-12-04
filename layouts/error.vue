<template>
  <div :class="[{ 'server-error': !is404, 'not-found': is404 }, 'error']">
    <div class="container">
      <template v-if="is404">
        <h1 class="error__heading">404</h1>
        <NuxtLink class="error__link" to="/">Home</NuxtLink>
        <img class="error__icon plug" src="~/assets/img/plug.svg" />
        <img class="error__icon socket" src="~/assets/img/socket.svg" />
      </template>
      <template v-else>
        <h1 class="error__heading">50</h1>
        <p>這個網頁無法正常運作</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  computed: {
    is404() {
      return this.error.statusCode === 404
    },
  },
}
</script>

<style lang="scss" scoped>
$font: Arial Rounded MT Bold, Arial;

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: #fff;
  font-size: 16px;
  letter-spacing: 2px;
  background-color: #003365;
  overflow: hidden;
  @include media-breakpoint-up(md) {
    font-size: 30px;
  }
  .container {
    position: relative;
  }
  &__heading {
    font-size: 50px;
    font-family: $font;
    line-height: 1;
    @include media-breakpoint-up(md) {
      font-size: 200px;
      + * {
        margin-top: 5px;
      }
    }
  }
  &__link {
    display: inline-block;
    padding: 9px 0;
    color: #ffcc01;
    font-size: 20px;
    font-family: $font;
    font-weight: bold;
    letter-spacing: 1.3px;
    text-decoration: underline;
    @include media-breakpoint-up(md) {
      padding: 0;
      font-size: 50px;
    }
  }
  &.not-found {
    .container {
      text-align: center;
      transform: translateY(-50%);
    }
    .error__heading {
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 33px;
        display: block;
        width: calc(50vw - 50px);
        height: 4px;
        background-color: #979797;
        @include media-breakpoint-up(md) {
          top: 125px;
          width: calc(50vw - 150px);
          height: 10px;
        }
      }
      &::before {
        left: calc(-10% - 20px);
        transform: translateX(-100%);
        @include media-breakpoint-up(md) {
          left: calc(-10% - 50px);
        }
      }
      &::after {
        right: calc(-10% - 20px);
        transform: translateX(100%);
        @include media-breakpoint-up(md) {
          right: calc(-10% - 50px);
        }
      }
    }
    .error__icon {
      position: absolute;
      top: 25px;
      height: 20px;
      @include media-breakpoint-up(md) {
        top: 100px;
        height: 60px;
      }
      &.plug {
        left: 0;
        transform: translateX(calc(-100% - 20px));
        @include media-breakpoint-up(md) {
          transform: translateX(calc(-100% - 50px));
        }
      }
      &.socket {
        right: 0;
        transform: translateX(calc(100% + 20px));
        @include media-breakpoint-up(md) {
          transform: translateX(calc(100% + 50px));
        }
      }
    }
  }
  &.server-error {
    .container {
      transform: translate(-20px, -100%);
      @include media-breakpoint-up(md) {
        transform: translate(-20%, -50%);
      }
      @include media-breakpoint-up(xl) {
        transform: translate(-50%, -50%);
      }
    }
    .error__heading {
      position: relative;
      text-align: right;
      transform: translateX(5px);
      @include media-breakpoint-up(md) {
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
}
</style>
