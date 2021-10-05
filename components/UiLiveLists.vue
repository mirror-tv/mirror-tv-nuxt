<template>
  <div class="live">
    <div v-if="liveVideoId" class="live__item live-video">
      <HeadingBordered :showIcon="true" class="heading" :text="liveTitle" />
      <ClientOnly>
        <YoutubeEmbedByIframeApi
          :enableAutoplay="true"
          :videoId="liveVideoId"
        />
      </ClientOnly>
    </div>
    <div v-if="houseVideoId" class="live__item house-video">
      <HeadingBordered :showIcon="true" class="heading" :text="houseTitle" />
      <ClientOnly>
        <YoutubeEmbedByIframeApi
          :enableAutoplay="true"
          :videoId="houseVideoId"
        />
      </ClientOnly>
    </div>
    <div v-if="hasLivePlayListItems" class="live__item stream">
      <HeadingBordered :showIcon="true" class="heading" :text="streamTitle" />
      <ClientOnly>
        <YoutubeEmbedByIframeApi
          v-for="item in livePlayListIds"
          :key="item"
          :videoId="item"
          :enableAutoplay="true"
          class="stream__item"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'

export default {
  components: {
    HeadingBordered,
    YoutubeEmbedByIframeApi,
  },
  props: {
    liveTitle: {
      type: String,
      default: '',
    },
    houseTitle: {
      type: String,
      default: '',
    },
    streamTitle: {
      type: String,
      default: '',
    },
    liveVideoId: {
      type: String,
      default: '',
    },
    houseVideoId: {
      type: String,
      default: '',
    },
    livePlayListIds: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    hasLivePlayListItems() {
      return this.livePlayListIds?.length
    },
  },
}
</script>

<style lang="scss" scoped>
.live {
  &__item {
    &.stream {
      .stream__item {
        width: 100%;
        @include media-breakpoint-up(xl) {
          width: calc(100% + 2px);
          transform: translateX(-1px);
        }
      }
      .stream__item + .stream__item {
        margin: 16px 0 0;
        @include media-breakpoint-up(md) {
          margin: 20px 0 0;
        }
      }
    }
    .heading {
      margin: 0 0 20px;
      min-width: 110px;
    }
  }
  &__item + &__item {
    margin: 40px 0 0;
    @include media-breakpoint-up(md) {
      margin: 48px 0 0;
    }
  }
}
</style>
