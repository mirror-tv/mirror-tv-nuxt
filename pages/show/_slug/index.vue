<template>
  <ShowWrapper :showName="showName" :picture="picture">
    <section class="normal-show">
      <div class="normal-show__info">
        <main class="main">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="normal-show__introduction" v-html="introduction" />
          <UiHostList v-if="hasHosts" :hosts="hosts" />
        </main>
        <aside class="g-aside">
          <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
        </aside>
      </div>
      <section class="normal-show__list-wrapper">
        <UiShowToggleList
          v-if="shouldShowToggleList"
          :titleA="firstName"
          :titleB="secondName"
          :playlists="validPlaylists"
          @video-click="sendGaClickEvent('video')"
          @click-load-more="handleClickLoadmore"
        />
        <UiShowYtVideoList
          v-for="list in validPlaylists"
          v-else
          :key="list.sectionName"
          :list="list"
          @video-click="sendGaClickEvent('video')"
          @click-load-more="handleClickLoadmore"
        />
      </section>
    </section>
  </ShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { getContactImageUrl } from '~/utils/image-handler'
import {
  handleLineBreak,
  handleApiData,
  handleMetaDesc,
} from '~/utils/content-handler'
import { sendGaEvent } from '~/utils/google-analytics'
import ShowWrapper from '~/components/ShowWrapper'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import UiHostList from '~/components/UiHostList'
import UiShowToggleList from '~/components/UiShowToggleList'
import UiShowYtVideoList from '~/components/UiShowYtVideoList'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
          shouldFetchHost: true,
          squareHostImg: true,
        }
      },
      update(data) {
        const item = data.allShows?.[0] || {}
        if (!item?.name || item?.isArtShow) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        this.initShowList(data)
        return item
      },
    },
  },
  components: {
    ShowWrapper,
    FacebookPagePlugin,
    UiHostList,
    UiShowToggleList,
    UiShowYtVideoList,
  },
  data() {
    return {
      show: {},
      playlists: [],
      innerWidth: 0,
      has404Err: false,
    }
  },
  head() {
    const title = this.showName ? `${this.showName} - ${SITE_NAME}` : SITE_NAME
    const image = this.show?.picture?.urlDesktopSized
    const description = handleMetaDesc(this.introduction)
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
    facebookUrl() {
      return this.show.facebookUrl
    },
    introduction() {
      return handleLineBreak(this.show.introduction)
    },
    showName() {
      return this.show.name
    },
    picture() {
      return this.show.picture
    },
    hosts() {
      return this.show?.hostName?.map((item) => this.reduceHost(item)) ?? []
    },
    validPlaylists() {
      return this.playlists.filter((list) => list.items.length !== 0)
    },
    firstName() {
      return this.show.playList01?.split('：')[1] ?? '選單 A'
    },
    secondName() {
      return this.show.playList02?.split('：')[1] ?? '選單 B'
    },
    isMobile() {
      return this.innerWidth < 768
    },
    hasHosts() {
      return this.hosts?.length ?? ''
    },
    shouldShowToggleList() {
      return this.isMobile && this.validPlaylists?.length
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
    reduceHost(item) {
      return {
        href: `/anchorperson/${item.slug}`,
        name: item.name,
        image: getContactImageUrl(item),
        bio: this.formatBio(item),
      }
    },
    initShowList(data) {
      const { playList01 = '', playList02 = '' } = data?.allShows?.[0] || {}
      const youtubeUrls = [playList01, playList02]
      if (process.browser) {
        this.innerWidth = window.innerWidth
      }
      if (!this.playlists.length) {
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
    },
    async loadYoutubeListData(list) {
      if (list.id) {
        try {
          const pageToken = list.nextPageToken
            ? `&pageToken=${list.nextPageToken}`
            : ''
          const num = this.formatVideoNum(this.innerWidth)
          const response = await this.$fetchYoutubeData(
            `/playlistItems?part=snippet${pageToken}&playlistId=${list.id}&maxResults=${num}`
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
    formatVideoNum(innerWidth) {
      return innerWidth < 768 ? 2 : 9
    },
    formatBio(item) {
      const bios = handleApiData(item.bioApiData)
      return bios?.map((item) => {
        return {
          id: item?.id || '',
          content: item?.content?.[0] || '',
        }
      })
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
.normal-show {
  flex: 1;
  margin: 24px 0 0;
  @include media-breakpoint-up(md) {
    margin: 40px 0 0;
  }
  @include media-breakpoint-up(xl) {
    margin: 48px 0 0;
  }
  .main {
    margin: 0;
  }
  .g-aside {
    width: 100%;
    margin: 16px auto 0;
    @include media-breakpoint-up(md) {
      min-width: 320px;
      max-width: 320px;
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
    margin: 24px 0;
    @include media-breakpoint-up(md) {
      width: 308px;
      margin: 0 0 48px;
    }
    @include media-breakpoint-up(xl) {
      width: 600px;
    }
  }
}
</style>
