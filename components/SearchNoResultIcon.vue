<template>
  <div class="no-result-icon">
    <div class="no-result-icon__icon">
      <img v-lazy="require('@/assets/img/tv-man.svg')" alt="" />
    </div>

    <div class="no-result-icon__keyword">您的搜尋「{{ keyword }}」</div>
    <div class="no-result-icon__prompt">查無相關結果</div>
  </div>
</template>

<script>
export default {
  props: {
    keyword: {
      type: String,
      isRequired: true,
      default: () => {
        return ''
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.no-result-icon {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    width: 166px;
    height: 204px;
    margin: 52.84px 0 21px;

    // tablet size
    @include media-breakpoint-up(md) {
      width: 200px;
      height: 246px;
    }

    // desktop size
    @include media-breakpoint-up(md) {
      margin: 26px 0 21px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &__keyword {
    margin-bottom: 3px;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    text-align: center;
    color: #898f9c;
  }

  &__prompt {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: black;
  }
}
</style>
