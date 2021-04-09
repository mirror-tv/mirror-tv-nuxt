<template>
  <div :class="[{ 'server-error': !is404, 'not-found': is404 }, 'error']">
    <div v-if="is404" class="container">
      <div class="error_info">
        <h1 class="error_info_heading">404</h1>
        <NuxtLink class="error_info_link" to="/">Home</NuxtLink>
      </div>

      <div class="error__wire_left">
        <img class="error__icon plug" src="~/assets/img/plug.svg" />
        <div class="error__wire_1" />
        <div class="error__wire_2" />
      </div>

      <div class="error__wire_right">
        <img class="error__icon socket" src="~/assets/img/socket.svg" />
        <div class="error__wire_1" />
        <div class="error__wire_2" />
      </div>
    </div>

    <div v-else class="container">
      <div class="error_info">
        <h1 class="error_info_heading">50<span class="drop_zero">0</span></h1>

        <p class="error_info_text">這個網頁無法正常運作</p>
      </div>
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
      return this.error.statusCode !== 404
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
  background-color: #003365;

  .container {
    position: relative;
  }
  .error_info {
    color: #fff;
    &_heading {
      font-family: $font;
      font-size: 51px;
      line-height: 1;
      margin-bottom: 12px;
      // tablet range
      @include media-breakpoint-up(md) {
        font-size: 110px;
      }
    }

    &_link {
      display: inline-block;
      padding: 9px 0;
      color: #ffcc01;
      font-size: 20px;
      font-family: $font;
      font-weight: bold;
      letter-spacing: 1.3px;
      text-decoration: underline;
      // tablet range
      @include media-breakpoint-up(md) {
        padding: 0;
        font-size: 58px;
      }
    }
  }

  &.not-found {
    .container {
      text-align: center;
      transform: translateY(-50%);
    }

    .error__wire_left,
    .error__wire_right {
      position: absolute;
      display: flex;
      height: 83px;
      width: 50vw;
      top: 35px;

      // tablet range
      @include media-breakpoint-up(md) {
        top: 75px;
      }

      .error__wire_1 {
        width: 0%;
        height: 100%;
        border-bottom: 4px solid #979797;
        // desktop range
        @include media-breakpoint-up(xl) {
          width: auto;
          flex: 1;
        }
      }
      .error__wire_2 {
        width: 100%;
        height: 100%;
        border-top: 4px solid #979797;
        border-left: 4px solid #979797;
        // desktop range
        @include media-breakpoint-up(xl) {
          width: 197px;
        }
      }
    }

    .error__wire_left {
      left: -11.72px;
      transform: translate(-110%, 0);
      // tablet range
      @include media-breakpoint-up(md) {
        left: -49px;
      }
    }

    .error__wire_right {
      right: -11.72px;
      transform: translate(110%, 0) scaleX(-1);
      // tablet range
      @include media-breakpoint-up(md) {
        right: -49px;
      }
    }

    .error__icon {
      position: absolute;
      top: 0;
      height: 34px;
      // tablet range
      @include media-breakpoint-up(md) {
        height: 45px;
      }
      &.plug {
        right: 0;
        transform: translate(35%, -46%);
      }
      &.socket {
        right: 0;
        transform: translate(15%, -46%) rotate(180deg);
      }
    }
  }

  &.server-error {
    .container {
      width: 190px;
      transform: translateY(-50%);

      // tablet range
      @include media-breakpoint-up(md) {
        width: 370px;
      }

      // desktop range
      @include media-breakpoint-up(xl) {
        width: 420px;
      }
    }
    .error_info {
      display: flex;
      flex-direction: column;
      &_heading {
        align-self: flex-end;
        display: inline-block;
        font-size: 70px;
        color: #fff;
        letter-spacing: 4px;
        margin: 0;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 152px;
          letter-spacing: 6px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 184px;
          letter-spacing: 5px;
        }
      }

      &_text {
        font-size: 14px;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 26px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 28px;
        }
      }

      .drop_zero {
        display: inline-block;
        transform: rotate(29deg) translate(30%, 30%);
      }
    }
  }
}
</style>
