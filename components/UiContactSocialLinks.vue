<template>
  <div class="contact-social-links">
    <a
      v-if="facebook"
      :href="facebook"
      target="_blank"
      rel="noreferrer noopener"
    >
      <img src="~/assets/img/social-media/fb-square-grey.svg" alt="Facebook" />
    </a>
    <a
      v-if="instagram"
      :href="instagram"
      target="_blank"
      rel="noreferrer noopener"
    >
      <img src="~/assets/img/social-media/ig-logo-grey.svg" alt="Instagram" />
    </a>
    <a v-if="twitter" :href="twitter" target="_blank" rel="noreferrer noopener">
      <img src="~/assets/img/social-media/twitter-black.svg" alt="Twitter" />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    facebook: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-social-links {
  display: flex;
  justify-content: center;
  @include media-breakpoint-up(md) {
    justify-content: start;
    margin: 0 0 0 12px;
  }
  a {
    position: relative;
    width: 20px;
    height: 20px;
    margin: 0 6px;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 12px;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
