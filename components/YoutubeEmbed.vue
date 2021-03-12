<template>
  <div class="iframe-wrapper">
    <iframe
      width="560"
      height="315"
      :src="iframeSrc"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      loading="lazy"
    />
  </div>
</template>

<script>
export default {
  props: {
    videoId: {
      type: String,
      required: true,
    },
    // 只有桌機版有效，若要在手機版也可以自動播放請改用 YoutubeEmbedByIframeApi.vue
    enableAutoplay: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    iframeSrc() {
      let src = `https://www.youtube.com/embed/${this.videoId}?playsinline=1`
      if (this.enableAutoplay) {
        src += '&autoplay=1&mute=1'
      }
      return src
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  > iframe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-position: center;
  }
}
</style>
