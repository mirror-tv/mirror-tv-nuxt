<template>
  <a
    :href="`https://twitter.com/intent/tweet?url=${shareUrl}`"
    class="share"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span>
      <img
        src="~/assets/img/social-media/twitter-black.svg"
        alt="分享至 twitter"
        loading="lazy"
      />
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
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 1px solid #d8d8d8;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border-radius: 50%;
      background-color: transparent;
    }
    &:hover {
      &::after {
        background-color: #9b9b9b;
        opacity: 0.05;
      }
    }
    &:active {
      &::after {
        background-color: #9b9b9b;
        opacity: 0.15;
      }
    }
  }
  img {
    display: block;
    width: 45%;
    height: 45%;
  }
}
</style>
