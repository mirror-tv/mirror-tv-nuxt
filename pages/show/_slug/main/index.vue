<template>
  <ShowWrapper
    currentSection="main"
    gaCategory="ArtShow_main"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <section class="artshow__main">
      <div class="artshow__main__info">
        <main class="main">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="artshow__main__introduction" v-html="introduction" />
          <div v-if="shouldShowHostList" class="artshow__main__host-list">
            <h3>主持人</h3>
            <UiArtshowHostList :hostList="hostList" />
          </div>
        </main>
        <aside class="g-aside">
          <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
        </aside>
      </div>
      <section v-if="shouldShowTrailerList" class="artshow__main__collect">
        <h3>{{ slideName }}</h3>
        <ol v-if="isMobile">
          <li v-for="item in trailerList.items" :key="item.id">
            <YoutubeEmbedByIframeApi :videoId="item.id" />
            <h4 v-text="item.title" />
          </li>
          <div class="position-correct" />
        </ol>
        <ClientOnly>
          <VideoListSlides
            v-if="!isMobile"
            :items="trailerList.items"
            class="slide"
            @click-slide-item="sendGaClickEvent('預告片')"
            @click-slide-next-and-pre="sendGaClickEvent('左右看更多按鍵')"
          />
        </ClientOnly>
      </section>
      <section v-if="shouldShowArtShowList" class="artshow__main__collect">
        <h3>所有影片</h3>
        <ClientOnly>
          <ArtShowVideoList
            :artShowList="artShowList"
            :currentShow="currentShow"
            :showLoadMoreButton="showLoadMoreButton"
            @click-more-button="handleClickMore"
            @click-video="sendGaClickEvent('所有影片的每支影片')"
          />
        </ClientOnly>
      </section>
    </section>
  </ShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleMetaDesc } from '~/utils/content-handler'
import ShowWrapper from '~/components/ShowWrapper'
import UiArtshowHostList from '~/components/UiArtshowHostList'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import VideoListSlides from '~/components/VideoListSlides'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchArtShowsByShowSlug } from '~/apollo/queries/artShow.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentShow,
          shouldFetchHost: true,
          squareHostImg: true,
        }
      },
      update(data) {
        const item = data.allShows?.[0] || {}
        if (!item?.name || !item?.isArtShow) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        this.initTrailerList(data)
        return item
      },
    },
    sectionList: {
      query: fetchSectionByShowSlug,
      variables() {
        return {
          showSlug: this.currentShow,
        }
      },
      update: (data) => data.allSections || [],
    },
    artShowList: {
      query: fetchArtShowsByShowSlug,
      variables() {
        return {
          first: 8,
          skip: 0,
          slug: this.currentShow,
        }
      },
      update(data) {
        this.artShowCount = data?._allArtShowsMeta?.count
        return data.allArtShows || []
      },
    },
  },
  components: {
    ShowWrapper,
    UiArtshowHostList,
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    ArtShowVideoList,
    VideoListSlides,
  },
  data() {
    return {
      show: {},
      artShowList: [],
      trailerList: {},
      isMobile: false,
      has404Err: false,
      page: 0,
      slideName: '最新預告',
      sectionList: [],
      artShowCount: 0,
    }
  },
  head() {
    const title = `${this.show.name} - ${SITE_NAME}`
    const image = this.show?.picture?.urlDesktopSized
    const description = handleMetaDesc(this.show.introduction)
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getUrlOrigin(this.$config)}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        ...(description
          ? [
              {
                hid: 'description',
                name: 'description',
                content: description,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: description,
              },
            ]
          : []),
      ],
    }
  },
  computed: {
    currentShow() {
      return this.$route.params.slug ?? ''
    },
    showLoadMoreButton() {
      return this.artShowList?.length < this.artShowCount
    },
    introduction() {
      if (
        this.show.introduction &&
        typeof this.show.introduction === 'string'
      ) {
        const string = this.show.introduction.replace(/\n|\r\n/g, '<br>')
        return string
      } else {
        return null
      }
    },
    hostList() {
      return this.show?.hostName ?? []
    },
    facebookUrl() {
      return this.show.facebookUrl ?? ''
    },
    shouldShowHostList() {
      return this.hostList?.length
    },
    shouldShowTrailerList() {
      return this.trailerList?.items?.length
    },
    shouldShowArtShowList() {
      return this.artShowList && this.artShowList?.length
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    reducePlaylistItems(item) {
      return {
        id: item?.snippet?.resourceId?.videoId,
        title: item?.snippet?.title,
      }
    },
    initTrailerList(data) {
      const { trailerPlaylist = '' } = data?.allShows?.[0] || {}
      if (process.browser) {
        this.isMobile = window.innerWidth < 768
      }
      if (trailerPlaylist) {
        this.slideName = trailerPlaylist?.split('：')[1] ?? '最新預告'
        const url = trailerPlaylist?.split('：')[0]
        const id = url.includes('playlist?list=')
          ? url.split('list=')[1]
          : url.split('https://youtu.be/')[1]
        this.trailerList = {
          id,
          items: [],
        }
        this.loadYoutubeListData(this.trailerList)
      }
    },
    async loadYoutubeListData(list) {
      if (list.id) {
        try {
          const response = await this.$fetchYoutubeData(
            `/playlistItems?part=snippet&playlistId=${list.id}&maxResults=7`
          )
          response?.items?.forEach((item) => {
            list.items.push(this.reducePlaylistItems(item))
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[ERROR]Youtube API:', error.message)
        }
      }
    },
    handleClickMore() {
      this.page++
      this.sendGaClickEvent('看更多按鍵')
      this.$apollo.queries.artShowList.fetchMore({
        variables: {
          first: 8,
          skip: 8 * this.page,
          slug: this.show.slug,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return {
            allArtShows: [
              ...previousResult.allArtShows,
              ...fetchMoreResult.allArtShows,
            ],
            _allArtShowsMeta: fetchMoreResult._allArtShowsMeta,
          }
        },
      })
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ArtShow_main')('click')(label)
    },
  },
}
</script>
<style lang="scss" scoped>
.artshow {
  &__main {
    flex: 1;
    margin-top: 24px;
    @include media-breakpoint-up(md) {
      margin-top: 40px;
    }
    @include media-breakpoint-up(xl) {
      margin-top: 48px;
    }
    .main {
      margin: 0;
    }
    .g-aside {
      width: 100%;
      margin: 16px auto 0;
      @include media-breakpoint-up(md) {
        width: 320px;
        padding: 0;
        margin: 0 0 0 auto;
      }
    }
    &__info {
      margin: 0 0 50px;
      @include media-breakpoint-up(md) {
        display: flex;
        margin: 0 0 60px;
      }
    }
    &__introduction {
      text-align: justify;
      font-weight: 400;
      font-size: 16px;
      line-height: 32px;
      @include media-breakpoint-up(md) {
        width: 308px;
      }
      @include media-breakpoint-up(xl) {
        width: 600px;
      }
    }
    &__host-list {
      margin: 24px 0 0;
      @include media-breakpoint-up(md) {
        margin: 60px 0 0;
      }
      @include media-breakpoint-up(xl) {
        width: 600px;
        margin: 100px 0 0;
      }
      h3 {
        font-size: 18px;
        font-weight: 500;
        line-height: 1.6;
        color: $color-blue;
        margin: 0 0 16px;
        @include media-breakpoint-up(xl) {
          font-size: 20px;
          margin: 0 0 20px;
        }
      }
    }
    &__collect {
      width: 100%;
      margin: 0 0 48px;
      @include media-breakpoint-up(xl) {
        margin: 0 0 60px;
      }
      h3 {
        color: $color-blue;
        font-size: 18px;
        font-weight: 500;
        line-height: 25px;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
        @include media-breakpoint-up(md) {
          margin-bottom: 20px;
          font-size: 20px;
          line-height: 160%;
        }
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
          &::after {
            content: '';
            width: calc((100% - 96px) / 4);
          }
          .position-correct {
            width: calc((100% - 96px) / 4);
            overflow: hidden;
          }
        }
        @include media-breakpoint-up(xxl) {
          &::after {
            content: '';
            width: calc((100% - 48px) / 4);
          }
          .position-correct {
            width: calc((100% - 48px) / 4);
            overflow: hidden;
          }
        }
        li {
          margin-bottom: 20px;
          @include media-breakpoint-up(md) {
            width: calc((100% - 64px) / 3);
            margin-bottom: 40px;
          }
          @include media-breakpoint-up(xl) {
            width: calc((100% - 96px) / 4);
            margin-bottom: 48px;
          }
          h4 {
            font-size: 16px;
            font-weight: 400;
            line-height: 22px;
            margin-top: 12px;
          }
          a {
            display: block;
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background-color: $color-grey;
            overflow: hidden;
            img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center center;
            }
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
}
</style>
