<template>
  <div v-if="shouldShowList" class="yt-list">
    <h3 v-text="list.sectionName" />
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
      v-if="shouldShowLoadMore"
      class="g-button-load-more"
      @click.native="handleClickLoadmore(list)"
    />
  </div>
</template>

<script>
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import ButtonLoadmore from '~/components/ButtonLoadmore'

export default {
  name: 'UiShowYtVideoList',
  components: {
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
  },
  props: {
    list: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    shouldShowList() {
      return this.list && this.list?.items?.length
    },
    shouldShowLoadMore() {
      return this.list?.nextPageToken
    },
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
.yt-list {
  width: 100%;
  margin: 12px 0;
  @include media-breakpoint-up(md) {
    margin: 0 0 24px;
  }
  @include media-breakpoint-up(xl) {
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
</style>
