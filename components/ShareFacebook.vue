<template>
  <a
    :href="`https://www.facebook.com/share.php?u=${shareUrl}`"
    class="share"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img src="~/assets/img/flogo.svg" alt="分享至 Facebook" loading="lazy" />
  </a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      isMounted: false
    }
  },
  computed: {
    shareUrl() {
      return this.url || (this.isMounted && location.href)
    }
  },
  mounted() {
    this.isMounted = true
  }
}
</script>

<style lang="scss" scoped>
.share {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #c1c2c2;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  img {
    display: block;
    width: 24px;
  }
}
</style>
