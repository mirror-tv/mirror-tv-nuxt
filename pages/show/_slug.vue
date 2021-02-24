<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="scheduleName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="scheduleName" />
      </picture>
      <main class="main">
        <div class="show__introduction" v-text="introduction" />
      </main>
      <aside class="g-aside">
        <div v-if="trailerYoutubeId" class="show__trailer">
          <h3>預告</h3>
          <IframeEmbedYoutube :videoId="trailerYoutubeId" />
        </div>
        <FacebookPagePlugin
          v-if="facebookUrl"
          :href="facebookUrl"
          class="show__facebook-page"
        />
      </aside>
    </div>
    <div class="g-page__wrapper">
      <div class="show__collect" v-if="hasPlaylistItems">
        <h3>選集</h3>
        <ol>
          <li v-for="item in playlistItems" :key="item.id">
            <IframeEmbedYoutube :videoId="item.id" />
            <h4 v-text="item.title"></h4>
          </li>
        </ol>
        <ButtonLoadmore
          v-if="nextPageToken"
          class="g-button-load-more"
          @click.native="loadYoutubeListData"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import IframeEmbedYoutube from '~/components/IframeEmbedYoutube'
import ButtonLoadmore from '~/components/ButtonLoadmore'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
  },
  components: {
    FacebookPagePlugin,
    IframeEmbedYoutube,
    ButtonLoadmore,
  },
  data() {
    return {
      show: {},
      playlistItems: [],
      nextPageToken: '',
    }
  },
  head() {
    const title = `${this.scheduleName} - ${SITE_NAME}`
    const image = this.show?.bannerImg?.urlDesktopSized
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getDomain()}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        ...(image
          ? [
              {
                hid: 'og:image',
                property: 'og:image',
                content: image,
              },
            ]
          : []),
        ...(this.introduction
          ? [
              {
                hid: 'description',
                name: 'description',
                content: this.introduction,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: this.introduction,
              },
            ]
          : []),
      ],
    }
  },
  computed: {
    facebookUrl() {
      return this.show.facebookUrl
    },
    introduction() {
      return this.show.introduction
    },
    scheduleName() {
      return this.show.schedule?.name
    },
    picture() {
      return this.show.picture
    },
    hasPlaylistItems() {
      return this.playlistItems.length
    },
    youtubePlaylistId() {
      const youtubePlaylistUrl = this.show.youtubePlaylistUrl ?? ''
      if (youtubePlaylistUrl.includes('playlist?list=')) {
        return youtubePlaylistUrl.split('list=')[1]
      }
      return youtubePlaylistUrl.split('https://youtu.be/')[1]
    },
    trailerYoutubeId() {
      const trailerUrl = this.show.trailerUrl ?? ''
      if (trailerUrl.includes('watch?v=')) {
        return trailerUrl.split('v=')[1]
      }
      return trailerUrl.split('https://youtu.be/')[1]
    },
  },
  mounted() {
    this.loadYoutubeListData()
  },
  methods: {
    reducePlaylistItems(item) {
      return {
        id: item?.snippet?.resourceId?.videoId,
        title: item?.snippet?.title,
      }
    },
    async loadYoutubeListData() {
      if (this.youtubePlaylistId) {
        try {
          const testLink = 'PLIufxCyJpxOx4fCTTNcC7XCVZgY8MYQT5'
          const pageToken = this.nextPageToken
            ? `&pageToken=${this.nextPageToken}`
            : ''
          const response = await this.$fetchYoutubeData(
            `/playlistItems?part=snippet${pageToken}&playlistId=${testLink}&maxResults=8`
          )
          this.nextPageToken = response?.nextPageToken
          response?.items?.forEach((item) => {
            this.playlistItems.push(this.reducePlaylistItems(item))
          })
        } catch (error) {
          console.error('[ERROR]Youtube API:', error.message)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.show {
  &.g-page--with-aside {
    .g-page__wrapper {
      max-width: 700px;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-wrap: wrap;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1120px;
      }
      .main {
        margin: 24px auto 0;
        @include media-breakpoint-up(md) {
          max-width: 470px;
          margin: 28px 0 0;
        }
        @include media-breakpoint-up(xxl) {
          max-width: 640px;
        }
      }
      .g-aside {
        margin: 24px auto 0;
        @include media-breakpoint-up(md) {
          width: 200px;
          margin: 24px 0 0 auto;
        }
        @include media-breakpoint-up(xxl) {
          width: 320px;
          padding: 0;
        }
      }
    }
  }
  &__name {
    width: 100%;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    @include media-breakpoint-up(md) {
      font-size: 30px;
      line-height: 35px;
    }
  }
  &__banner-image {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    margin: 18px auto 0;
    padding-top: 37.5%;
    transform: translateX(-16px);
    @include media-breakpoint-up(md) {
      width: 100%;
      margin: 9px auto 0;
      transform: none;
    }
    @include media-breakpoint-up(xxl) {
      margin: 24px auto 0;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
  &__introduction {
    text-align: justify;
  }
  &__trailer {
    h3 {
      color: $color-blue;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
      letter-spacing: 0.5px;
      + div {
        margin-top: 10px;
      }
    }
    + .show__facebook-page {
      margin-top: 24px;
      @include media-breakpoint-up(md) {
        margin-top: 20px;
      }
      @include media-breakpoint-up(xxl) {
        margin-top: 24px;
      }
    }
  }
  &__collect {
    margin-top: 24px;
    &__loadmore {
      display: flex;
      justify-content: center;
    }
    h3 {
      color: $color-blue;
      font-size: 20px;
      font-weight: 500;
      line-height: 23px;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    ol {
      @include media-breakpoint-up(md) {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
      }
      li {
        margin-bottom: 24px;
        @include media-breakpoint-up(md) {
          width: calc(100% * 8 / 35);
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
