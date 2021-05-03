<template>
  <a
    :href="`https://social-plugins.line.me/lineit/share?url=${shareUrl}`"
    class="share"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>
      <img src="~/assets/img/LINE_logo.png" alt="分享至 Line" loading="lazy" />
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
  padding: 4px;
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #c1c2c2;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  }
  img {
    display: block;
    width: 24px;
  }
}
</style>
