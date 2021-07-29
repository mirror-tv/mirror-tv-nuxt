<template>
  <ArtShowWrapper
    currentSection="about"
    gaCategory="ArtShow_main"
    :currentShow="currentShow"
    :showName="show.name"
    :bannerImg="show.bannerImg"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <section class="artshow__about">
      <section class="artshow__about__info">
        <main class="main">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="artshow__about__introduction" v-html="introduction" />
        </main>
        <aside class="g-aside">
          <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
        </aside>
      </section>
      <section class="artshow__about__collect">
        <h3>未來一週預告</h3>
        <template v-if="trailerList.items[0]">
          <template v-if="isMobile">
            <ol>
              <li v-for="item in trailerList.items" :key="item.id">
                <YoutubeEmbedByIframeApi :videoId="item.id" />
                <h4 v-text="item.title" />
              </li>
              <div class="position-correct" />
            </ol>
          </template>
        </template>
        <template v-else>
          <VideoListSlides
            v-if="trailerList.items.length"
            :items="trailerList.items"
            class="slide"
            @click-slide-item="sendGaClickEvent('預告片')"
            @click-slide-next-and-pre="sendGaClickEvent('左右看更多按鍵')"
          />
        </template>
        <h3>所有影片</h3>
        <ClientOnly>
          <ArtShowVideoList
            v-if="artShowList && artShowList.length"
            :artShowList="artShowList"
            :currentShow="currentShow"
            :showLoadMoreButton="showLoadMoreButton"
            @click-more-button="handleClickMore"
            @click-video="handleClickVideo"
          />
        </ClientOnly>
      </section>
    </section>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArtShowWrapper from '~/components/ArtShowWrapper.vue'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import VideoListSlides from '~/components/VideoListSlides'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchAllArtShowsByShowLatest } from '~/apollo/queries/artShow.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'
export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentShow,
        }
      },
      result({ data, loading }) {
        if (!loading) {
          const { playList01 = '' } = data.allShows?.[0] || {}
          if (process.browser) {
            this.isMobile = window.innerWidth < 768
          }
          if (playList01) {
            const url = playList01.split('：')[0]
            const id = url.includes('playlist?list=')
              ? url.split('list=')[1]
              : url.split('https://youtu.be/')[1]
            this.trailerList = {
              id,
              items: [],
            }
            this.loadYoutubeListData(this.trailerList)
          }
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
    sectionList: {
      query: fetchSectionByShowSlug,
      variables() {
        return {
          showSlug: this.currentShow,
        }
      },
      update: (data) => data.allSections || {},
    },
    artShowList: {
      query: fetchAllArtShowsByShowLatest,
      variables() {
        return {
          first: 8,
          skip: 0,
          show: this.show.name,
        }
      },
      update(data) {
        this.artShowCount = data?._allArtShowsMeta?.count
        return data.allArtShows || {}
      },
    },
  },
  components: {
    ArtShowWrapper,
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    ArtShowVideoList,
    VideoListSlides,
  },
  data() {
    return {
      show: {},
      artShowList: {},
      trailerList: {},
      isMobile: false,
      page: 0,
      sectionList: [],
      artShowCount: 0,
    }
  },
  head() {
    const title = `${this.show.name} - ${SITE_NAME}`
    const image = this.show?.bannerImg?.urlDesktopSized
    return {
      title,
      description: this.introduction,
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
    facebookUrl() {
      return this.show.facebookUrl ?? ''
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
      sendGaEvent(this.$ga)('ArtShow_main')('click')('看更多按鍵')
      this.$apollo.queries.artShowList.fetchMore({
        variables: {
          first: 8,
          skip: 8 * this.page,
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
    handleClickVideo() {
      sendGaEvent(this.$ga)('ArtShow_main')('click')('所有影片的每支影片')
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ArtShow_main')('click')(label)
    },
  },
}
</script>
<style lang="scss" scoped>
.artshow {
  &__about {
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
      margin: 48px auto 0;
      @include media-breakpoint-up(md) {
        width: 320px;
        padding: 0;
        margin: 28px 0 0 auto;
      }
      @include media-breakpoint-up(xl) {
        width: 320px;
        padding: 0;
      }
    }
    &__info {
      @include media-breakpoint-up(md) {
        display: flex;
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
    &__collect {
      margin-top: 12px;
      .slide {
        margin-bottom: 28px;
        @include media-breakpoint-up(md) {
          margin-bottom: 48px;
        }
        @include media-breakpoint-up(md) {
          margin-bottom: 80px;
        }
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
