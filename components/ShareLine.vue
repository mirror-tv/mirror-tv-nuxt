<template>
  <a
    :href="`https://social-plugins.line.me/lineit/share?url=${shareUrl}`"
    class="share"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>
      <img src="~/assets/img/line-icon.svg" alt="分享至 Line" loading="lazy" />
    </span>
  </a>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: undefined,
    },
  },
  data() {
    return {
      isMounted: false,
    }
  },
  computed: {
    shareUrl() {
      return encodeURIComponent(this.url || (this.isMounted && location.href))
    },
  },
  mounted() {
    this.isMounted = true
  },
}
</script>

<style lang="scss" scoped>
.share {
  display: inline-block;
  width: 40px;
  height: 40px;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #d8d8d8;
  }
  img {
    display: block;
    width: 60%;
    height: 60%;
  }
}
</style>
