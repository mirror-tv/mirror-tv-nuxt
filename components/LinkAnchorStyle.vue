<template>
  <a
    href="/anchorperson"
    class="link"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="link__left-block">
      <slot name="left-block">
        <img v-lazy="require('~/assets/img/icon/yt-black.svg')" alt="鏡主播" />
        <span>鏡主播</span>
      </slot>
    </div>
    <div class="link__right-block">
      <slot name="right-block">
        <img
          v-lazy="require('~/assets/img/icon/microphone.svg')"
          class="subscription-icon"
          alt="追蹤"
        />
        <span>追蹤</span>
      </slot>
    </div>
  </a>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.link {
  display: flex;
  width: 100%;
  height: 50px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  background-color: #4a4a4a;
  margin-bottom: 24px;
  &__left-block {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 3px;
    > img {
      width: 40px;
      height: 28px;
      + * {
        margin-left: 24px;

        // tablet range
        @include media-breakpoint-up(sm) {
          margin-left: 16px;
        }

        // desktop wide range
        @include media-breakpoint-up(lg) {
          margin-left: 24px;
        }
      }
    }
  }
  &__right-block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    letter-spacing: 0.8px;
    background-color: rgb(28, 178, 230);

    // desktop narrow range
    @include media-breakpoint-up(md) {
      width: 80px;
    }

    // desktop wide range
    @include media-breakpoint-up(lg) {
      width: 120px;
    }
  }
}
.subscription-icon {
  width: 18px;
  margin: 0 4px 0 0;
  //   transform: translateY(-12px);
}
</style>
