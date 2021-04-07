<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="showName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <main class="main">
        <div class="show__introduction" v-text="introduction" />
        <ol class="host__container">
          <li v-for="host in hosts" :key="host.name" class="host__wrapper">
            <img
              v-if="host.image"
              :src="host.image.urlMobileSized"
              :alt="host.name"
            />
            <img
              v-else
              src="~assets/img/image-default.png"
              alt="default image"
            />
            <div class="host__wrapper-content">
              <h3>主持人 ｜ {{ host.name }}</h3>
              <p v-if="host.bio">{{ host.bio }}</p>
            </div>
          </li>
        </ol>
      </main>
      <aside class="g-aside">
        <FacebookPagePlugin
          v-if="facebookUrl"
          :href="facebookUrl"
          class="test"
        />
      </aside>
    </div>
    <div class="g-page__wrapper">
      <div
        v-for="list in validPlaylists"
        :key="list.sectionName"
        class="show__collect"
      >
        <h3 v-text="list.sectionName" />
        <ol>
          <li v-for="item in list.items" :key="item.id">
            <YoutubeEmbedByIframeApi
              :videoId="item.id"
              @send-first-play-ga="sendGaClickEvent('video')"
            />
            <h4 v-text="item.title" />
          </li>
          <div class="position-correct" />
        </ol>
        <ButtonLoadmore
          v-if="list.nextPageToken"
          class="g-button-load-more"
          @click.native="handleClickLoadmore(list)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
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
      result({ data, loading }) {
        if (!loading) {
          const { playList01 = '', playList02 = '' } = data.allShows?.[0] || {}
          const youtubeUrls = [playList01, playList02]
          if (this.playlists.length < youtubeUrls.length) {
            youtubeUrls.forEach((item, i) => {
              if (item) {
                const [
                  url,
                  sectionName = `選單 ${String.fromCharCode(i + 65)}`,
                ] = item.split('：')
                const id = url.includes('playlist?list=')
                  ? url.split('list=')[1]
                  : url.split('https://youtu.be/')[1]

                this.playlists.push({
                  id,
                  sectionName,
                  nextPageToken: '',
                  items: [],
                })
              }
            })

            this.playlists.forEach((list) => {
              this.loadYoutubeListData(list)
            })
          }
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
  },
  components: {
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
  },
  data() {
    return {
      show: {},
      playlists: [],
    }
  },
  head() {
    const title = `${this.showName} - ${SITE_NAME}`
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
    showName() {
      return this.show.name
    },
    picture() {
      return this.show.picture
    },
    hosts() {
      return this.show.hostName ?? []
    },
    validPlaylists() {
      return this.playlists.filter((list) => list.items.length !== 0)
    },
  },
  methods: {
    reducePlaylistItems(item) {
      return {
        id: item?.snippet?.resourceId?.videoId,
        title: item?.snippet?.title,
      }
    },
    async loadYoutubeListData(list) {
      if (list.id) {
        try {
          const pageToken = list.nextPageToken
            ? `&pageToken=${list.nextPageToken}`
            : ''
          const response = await this.$fetchYoutubeData(
            `/playlistItems?part=snippet${pageToken}&playlistId=${list.id}&maxResults=8`
          )
          list.nextPageToken = response?.nextPageToken
          response?.items?.forEach((item) => {
            list.items.push(this.reducePlaylistItems(item))
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[ERROR]Youtube API:', error.message)
        }
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('show')('click')(label)
    },
    handleClickLoadmore(list) {
      this.loadYoutubeListData(list)
      this.sendGaClickEvent('load more button')
    },
  },
}
</script>

<style lang="scss" scoped>
.show {
  &.g-page {
    @include media-breakpoint-up(sm) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  &.g-page--with-aside {
    .g-page__wrapper {
      max-width: 688px;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-wrap: wrap;
      }
      @include media-breakpoint-up(xl) {
        max-width: 1120px;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1200px;
      }
      .main {
        margin: 24px auto 0;
        @include media-breakpoint-up(md) {
          width: 308px;
          margin: 28px 0 0;
        }
        @include media-breakpoint-up(lg) {
          width: 308px;
        }
        @include media-breakpoint-up(xl) {
          width: 600px;
        }
      }
      .g-aside {
        width: 100%;
        margin: 24px auto 0;
        .test {
          width: 100%;
        }
        @include media-breakpoint-up(md) {
          width: 320px;
          padding: 0;
          margin: 28px 0 0 auto;
        }
        @include media-breakpoint-up(xxl) {
          width: 320px;
          padding: 0;
        }
      }
    }
  }
  &__name {
    color: $color-blue;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0.5px;
    margin: 24px 0;
    @include media-breakpoint-up(md) {
      width: 100%;
      font-size: 30px;
      line-height: 42px;
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
      }
      @include media-breakpoint-up(xl) {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        &::after {
          content: '';
          width: calc((100% - 96px) / 4);
        }
        .position-correct {
          width: calc((100% - 96px) / 4);
          overflow: hidden;
        }
      }
      li {
        margin-bottom: 24px;
        @include media-breakpoint-up(md) {
          width: calc((100% - 64px) / 3);
        }
        @include media-breakpoint-up(xl) {
          width: calc((100% - 96px) / 4);
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

.host {
  &__container {
    margin-top: 24px;
  }
  &__wrapper {
    display: flex;
    position: relative;
    margin-bottom: 24px;
    padding: 6px 0 6px 24px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      background: linear-gradient(
        to bottom,
        #d8eaeb 25%,
        #fff 25%,
        #fff 50%,
        #e7e7e7 50%,
        #e7e7e7 75%,
        #c1c2c2 75%
      );
    }
    img {
      width: 70px;
      height: 70px;
      object-fit: cover;
      object-position: center;
      @include default-background-image;
      @include media-breakpoint-up(md) {
        width: 80px;
        height: 80px;
      }
    }
    &-content {
      margin-left: 10px;
      h3 {
        font-size: 20px;
        line-height: 20px;
        margin-bottom: 8px;
        @include media-breakpoint-up(md) {
          margin-bottom: 12px;
        }
      }
      p {
        font-size: 16px;
        line-height: 26px;
        text-align: left;
        word-wrap: break-word;
        word-break: break-all;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style>
