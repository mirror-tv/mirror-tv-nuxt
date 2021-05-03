<template>
  <div class="audio-player">
    <div class="audio-player__title">{{ audio.name }}</div>
    <div class="audio-player__wrapper">
      <div class="audio-player__control" @click="playingHandler">
        <div v-if="!isPlaying" class="audio-player__play">
          <div class="audio-player__play_triangle"></div>
        </div>

        <div v-else class="audio-player__pause">
          <div class="audio-player__pause_icon">
            <div class="audio-player__pause_icon_bar" />
            <div class="audio-player__pause_icon_bar" />
          </div>
        </div>
      </div>

      <div class="audio-player__duration">
        <input v-model="currentSec" type="range" min="0" :max="totalSec" />

        <div
          class="audio-player__duration_progress"
          :style="{ width: `${getProgressPercentage}` }"
        />

        <div class="audio-player__time">
          <div class="audio-player__time_block">
            {{ secondsToTime(currentSec) }}
          </div>
          <div class="audio-player__time_block">
            {{ remainSec }}
          </div>
        </div>
      </div>
    </div>
    <audio id="audio" preload="metadata">
      <source :src="audio.url" />
    </audio>
  </div>
</template>

<script>
export default {
  props: {
    audio: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isPlaying: false,
      currentSec: 0,
      totalSec: 240,
      targetSec: 0,
    }
  },

  computed: {
    remainSec() {
      const remainSec = this.totalSec - this.currentSec
      return this.secondsToTime(remainSec)
    },
    getProgressPercentage() {
      let percentage = Math.floor(
        (parseInt(this.currentSec) / this.totalSec) * 100
      )

      if (percentage < 50) {
        percentage = percentage + 1
      }
      return `${percentage}%`
    },
  },
  watch: {
    currentSec(value) {
      if (parseInt(value) !== this.targetSec) {
        const audioDOM = document.querySelector(`#audio`)
        audioDOM.currentTime = value
      }
    },
  },
  mounted() {
    this.getAudioDuration()
  },
  methods: {
    getAudioDuration() {
      const audioDOM = document.querySelector(`#audio`)
      if (!audioDOM) return

      this.totalSec = parseInt(audioDOM.duration)

      audioDOM.addEventListener('loadedmetadata', () => {
        if (audioDOM.duration === Infinity) {
          this.totalSec = 500
        } else {
          this.totalSec = audioDOM.duration
        }
      })
    },
    playingHandler() {
      const audioDOM = document.querySelector(`#audio`)
      audioDOM.addEventListener('timeupdate', () => {
        this.totalSec = parseInt(audioDOM.duration)
        this.currentSec = parseInt(audioDOM.currentTime)
        this.targetSec = parseInt(audioDOM.currentTime)
      })
      if (!this.isPlaying) {
        audioDOM.play()
      } else {
        audioDOM.pause()
      }
      this.isPlaying = !this.isPlaying
    },
    secondsToTime(seconds) {
      const minute = Math.floor(seconds / 60)
      const second = Math.floor(seconds % 60)
      return `${this.addZero(minute)}:${this.addZero(second)}`
    },
    addZero(time) {
      if (time < 10) {
        return `0${time}`
      } else {
        return `${time}`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.audio-player {
  width: 100%;
  height: 87px;
  background: #d8eaeb;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 8px 19px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__title {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    letter-spacing: 0.5px;
    color: #014db8;
  }

  &__wrapper {
    width: 100%;
    height: 35px;
    display: flex;
    flex-direction: row;
    position: relative;
  }

  &__control {
    width: 35px;
    height: 35px;
    cursor: pointer;
  }
  &__play {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #036;
    position: relative;

    &_triangle {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 8.5px 14.7px 8.5px;
      border-color: transparent transparent #f6cd46 transparent;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-33%, -50%) rotate(90deg);
    }
  }

  &__pause {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #036;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &_icon {
      width: 15px;
      height: 15px;
      display: flex;
      justify-content: space-between;

      &_bar {
        height: 15px;
        width: 5.667px;
        background: #f6cd46;
      }
    }
  }

  &__duration {
    margin-left: 16px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;

    input[type='range'] {
      position: relative;
      -webkit-appearance: none; /* 洗掉預設range樣式 */
      width: 100%;
      cursor: pointer;
      background: transparent;
      outline: none;

      &::-webkit-slider-runnable-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0), 0 0 1px rgba(13, 13, 13, 0);
        background: rgba(255, 255, 255, 0.8);
        // background: #014db8;
        border-radius: 1.3px;
        border: 0.2px solid rgba(1, 1, 1, 0);
      }

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        position: relative;
        width: 18px;
        height: 18px;
        background: #014db8;
        border-radius: 50%;
        transition: 0.2s; /* 點選放大時候的漸變時間 */
        margin-top: -6px;
      }
    }

    &_progress {
      position: absolute;
      content: '';
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 0;
      height: 8.4px;
      background: #014db8;
      pointer-events: none;
    }
  }

  &__time {
    width: 100%;
    height: 14px;
    position: absolute;
    left: 0;
    bottom: -5px;
    display: flex;
    justify-content: space-between;
    &_block {
      font-weight: 600;
      font-size: 10px;
      line-height: 14px;
      letter-spacing: 0.5px;
      color: #014db8;
    }
  }
}
</style>
