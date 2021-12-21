<template>
  <div class="links">
    <a v-if="fbUrl" :href="fbUrl" target="_blank" rel="noreferrer noopener">
      <img
        v-lazy="require('@/assets/img/social-media/fb-square-grey.svg')"
        class="social-img"
        alt="facebook"
      />
    </a>
    <a v-if="igUrl" :href="igUrl" target="_blank" rel="noreferrer noopener">
      <img
        v-lazy="require('@/assets/img/social-media/ig-logo-grey.svg')"
        class="social-img"
        alt="instagram"
      />
    </a>
    <a v-if="lineUrl" :href="lineUrl" target="_blank" rel="noreferrer noopener">
      <img
        v-lazy="require('@/assets/img/social-media/line-square-grey.svg')"
        class="social-img"
        alt="line"
      />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    fbUrl: {
      type: String,
      default: '',
    },
    igUrl: {
      type: String,
      default: '',
    },
    lineUrl: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.links {
  display: flex;
  align-items: center;
  a {
    width: 20px;
    height: 20px;
    display: block;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
    & + a {
      margin: 0 0 0 12px;
    }
  }
}
</style>
