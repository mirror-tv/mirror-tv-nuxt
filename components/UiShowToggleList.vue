<template>
  <section class="show-toggle">
    <div class="show-toggle__title">
      <button :class="{ active: isActive }" @click="isActive = true">
        <span>{{ titleA }}</span>
      </button>
      <button :class="{ active: !isActive }" @click="isActive = false">
        <span>{{ titleB }}</span>
      </button>
    </div>
    <div
      v-for="(list, i) in playlists"
      :key="list.sectionName"
      class="show-toggle__list"
    >
      <template v-if="(i === 0 && isActive) || (i === 1 && !isActive)">
        <h3 v-if="playlists.length <= 1" v-text="list.sectionName" />
        <ol>
          <li v-for="item in list.items" :key="item.id">
            <ClientOnly>
              <YoutubeEmbedByIframeApi
                :videoId="item.id"
                @send-first-play-ga="sendGaClickEvent"
              />
            </ClientOnly>
            <h4 v-text="item.title" />
          </li>
          <div class="position-correct" />
        </ol>
        <ButtonLoadmore
          v-if="list.nextPageToken"
          class="g-button-load-more"
          @click.native="handleClickLoadmore(list)"
        />
      </template>
    </div>
  </section>
</template>

<script>
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import ButtonLoadmore from '~/components/ButtonLoadmore'

export default {
  components: {
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
  },
  props: {
    titleA: {
      type: String,
      default: '',
    },
    titleB: {
      type: String,
      default: '',
    },
    playlists: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isActive: true,
    }
  },
  methods: {
    sendGaClickEvent() {
      this.$emit('video-click')
    },
    handleClickLoadmore(list) {
      this.$emit('click-load-more', list)
    },
  },
}
</script>

<style lang="scss" scoped>
.show-toggle {
  &__title {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    width: 100%;
    button {
      width: 50%;
      padding: 6px 0;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.5px;
      text-align: center;
      color: $color-blue;
      outline: none;
      border: solid 3px $color-blue;
    }
    .active {
      color: white;
      background-color: $color-blue;
    }
  }
  &__list {
    width: 100%;
    margin: 12px 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
    h3 {
      color: $color-blue;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    ol {
      @include media-breakpoint-up(md) {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &::after {
          content: '';
          width: calc((100% - 64px) / 3);
        }
        .position-correct {
          width: calc((100% - 64px) / 3);
          overflow: hidden;
        }
      }
      li {
        margin-bottom: 24px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 64px) / 3);
        }
        h4 {
          font-size: 16px;
          font-weight: 400;
          line-height: 23px;
          margin-top: 12px;
        }
      }
    }
    .g-button-load-more {
      @include media-breakpoint-up(md) {
        margin: 0 auto;
      }
    }
  }
}
</style>
