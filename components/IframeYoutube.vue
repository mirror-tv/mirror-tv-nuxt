<!-- Doc: https://developers.google.com/youtube/iframe_api_reference -->
<template>
  <div class="iframe-wrapper">
    <div :id="`player-${videoId}`" />
  </div>
</template>

<script>
// import { setIntersectionObserver } from '~/utils/intersection-observer'

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
      player: {},
      hasSentPlayEvent: false,
    }
  },
  watch: {
    videoId(value) {
      this.hasSentPlayEvent = false
      value && this.player.cueVideoById({ videoId: value })
    },
  },
  mounted() {
    this.loadIframePlayerApi()
  },
  beforeDestroy() {
    this.player && this.player?.destroy?.()
  },
  methods: {
    // Bug: Safari 沒辦法正常觸發
    // lazyloadYoutubeIframe() {
    //   setIntersectionObserver({
    //     elements: [document.querySelector(`#player-${this.videoId}`)],
    //     handler: (entries, observer) => {
    //       entries.forEach((entry) => {
    //         if (entry.isIntersecting) {
    //           this.createPlayer()
    //           observer.disconnect()
    //         }
    //       })
    //     },
    //   })
    // },

    // Improvement: lazyload
    loadIframePlayerApi() {
      if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        window.onYouTubeIframeAPIReady = () => this.createPlayer()
      } else {
        this.createPlayer()
      }
    },
    createPlayer() {
      if (this.videoId) {
        this.player = new window.YT.Player(`player-${this.videoId}`, {
          height: '390',
          width: '640',
          videoId: this.videoId,
          playerVars: {
            origin: location.origin,
            playsinline: 1,
          },
          events: {
            onReady: () => {
              if (this.enableAutoplay) {
                this.player.mute()
                this.player.playVideo()
              }
            },
            onStateChange: () => {
              // https://developers.google.com/youtube/iframe_api_reference#Playback_status
              const isPlaying = this.player.getPlayerState() === 1
              if (isPlaying && !this.hasSentPlayEvent) {
                this.hasSentPlayEvent = true
                this.$emit('send-first-play-ga')
              }
            },
          },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
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
