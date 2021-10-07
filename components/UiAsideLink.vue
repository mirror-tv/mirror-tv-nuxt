<template>
  <a :href="href" class="link" target="_blank" rel="noopener noreferrer">
    <div class="link__left-block">
      <slot name="left-block">
        <img
          v-lazy="leftIcon"
          :alt="leftText"
          :class="{ line: leftText === 'LINE' }"
        />
        <span>{{ leftText }}</span>
      </slot>
    </div>
    <div class="link__right-block" :style="{ 'background-color': themeColor }">
      <slot name="right-block">
        <img
          v-if="rightIcon"
          v-lazy="rightIcon"
          class="subscription-icon"
          :alt="rightText"
        />
        <span>{{ rightText }}</span>
      </slot>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '',
    },
    leftIcon: {
      type: String,
      default: '',
    },
    rightIcon: {
      type: String,
      default: '',
    },
    leftText: {
      type: String,
      default: '',
    },
    rightText: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '',
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
        margin-left: 16px;
        @include media-breakpoint-up(md) {
          margin-left: 26px;
        }
        @include media-breakpoint-up(xl) {
          margin-left: 24px;
        }
      }
    }
    .line {
      width: 35px;
      height: 35px;
      + * {
        margin-left: 24px;
        @include media-breakpoint-up(md) {
          margin-left: 34px;
        }
        @include media-breakpoint-up(xl) {
          margin-left: 32px;
        }
      }
    }
  }
  &__right-block {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 122px;
    letter-spacing: 0.8px;
    @include media-breakpoint-up(md) {
      width: 135px;
    }
    @include media-breakpoint-up(xl) {
      width: 120px;
    }
  }
}
.subscription-icon {
  width: 18px;
  margin: 0 4px 0 0;
}
</style>
