<!--
  Plugin Github: https://github.com/anteriovieira/vue-youtube
  Youtube Doc: https://developers.google.com/youtube/iframe_api_reference -->
<template>
  <div v-if="videoId" class="iframe-wrapper">
    <youtube
      :ref="`player-${videoId}`"
      :videoId="videoId"
      :playerVars="playerVars"
      @ready="handlePlayerReady"
      @playing="handlePlayerPlaying"
      @paused="handlePlayerPaused"
      @ended="handlePlayerEnded"
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
    enableAutoplay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hasSentPlayEvent: false,
      playerVars: {
        playsinline: 1,
      },
    }
  },
  computed: {
    player() {
      return this.$refs[`player-${this.videoId}`]?.player
    },
  },
  methods: {
    handlePlayerReady() {
      if (this.enableAutoplay) {
        this.player?.mute()
        this.player?.playVideo()
      }
    },
    handlePlayerPlaying() {
      this.$emit('is-playing', { ref: `player-${this.videoId}` })
      if (!this.hasSentPlayEvent) {
        this.hasSentPlayEvent = true
        this.$emit('send-first-play-ga')
      }
    },
    handlePlayerPaused() {
      this.$emit('is-paused')
    },
    handlePlayerEnded() {
      this.$emit('is-ended')
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
  width: 100%;
  ::v-deep {
    iframe {
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
}
</style>
