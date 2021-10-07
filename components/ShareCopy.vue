<template>
  <button type="button" class="share" @click.prevent="copyLink">
    <span>
      <img
        src="~/assets/img/icon/share-link.svg"
        alt="複製連結"
        loading="lazy"
      />
    </span>
  </button>
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
      return this.url || (this.isMounted && location.href)
    },
  },
  mounted() {
    this.isMounted = true
  },
  methods: {
    copyLink() {
      /*
       * Since element.focus({preventScroll: boolean})
       * not work in safari, we memory the depth when user clicked
       * doc: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
       */
      if (window) {
        const depth = window.pageYOffset
        const inputc = document.body.appendChild(
          document.createElement('input')
        )
        inputc.value = this.shareUrl
        // inputc.focus({ preventScroll: true })
        inputc.select()
        document.execCommand('copy')
        inputc.parentNode.removeChild(inputc)
        window.alert('連結已複製')
        window.scrollTo(0, depth)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.share {
  display: block;
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
  &:active,
  &:focus {
    outline: none;
  }
}
</style>
