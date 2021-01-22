<template>
  <a :href="href" class="link" target="_blank" rel="noopener noreferrer">
    <div class="link__left-block">
      <slot name="left-block">
        <img src="~/assets/img/yt_icon_rgb.png" alt="鏡新聞" />
        <span>鏡新聞</span>
      </slot>
    </div>
    <div class="link__right-block">
      <slot name="right-block">
        <img
          class="subscription-icon"
          src="~/assets/img/subscription.svg"
          alt="訂閱"
        />
        <span>訂閱</span>
      </slot>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: 'https://www.youtube.com/channel/UC4LjkybVKXCDlneVXlKAbmw',
    },
  },
}
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
      }
    }
  }
  &__right-block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    letter-spacing: 0.8px;
    background-color: #f00;
  }
}
.subscription-icon {
  width: 26px;
  transform: translateY(-12px);
}
</style>
