<template>
  <ShowWrapper :showName="showName" :picture="picture">
    <section class="show__main">
      <div class="show__main__info">
        <main class="main">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="show__main__introduction" v-html="introduction" />
          <UiHostList v-if="hasHosts" :hosts="hosts" />
        </main>
        <aside class="g-aside">
          <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
        </aside>
      </div>
      <section class="show__main__collect__wrapper">
        <template v-if="isMobile">
          <div
            v-if="validPlaylists.length > 1"
            class="show__main__button__wrapper"
          >
            <button :class="{ active: isActive }" @click="isActive = true">
              <span>{{ firstName }}</span>
            </button>
            <button :class="{ active: !isActive }" @click="isActive = false">
              <span>{{ secondName }}</span>
            </button>
          </div>
          <div
            v-for="(list, i) in validPlaylists"
            :key="list.sectionName"
            class="show__main__collect"
          >
            <template v-if="(i === 0 && isActive) || (i === 1 && !isActive)">
              <h3 v-if="validPlaylists.length <= 1" v-text="list.sectionName" />
              <ol>
                <li v-for="item in list.items" :key="item.id">
                  <ClientOnly>
                    <YoutubeEmbedByIframeApi
                      :videoId="item.id"
                      @send-first-play-ga="sendGaClickEvent('video')"
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
        </template>
        <template v-else>
          <div
            v-for="list in validPlaylists"
            :key="list.sectionName"
            class="show__main__collect"
          >
            <h3 v-text="list.sectionName" />
            <ol>
              <li v-for="item in list.items" :key="item.id">
                <ClientOnly>
                  <YoutubeEmbedByIframeApi
                    :videoId="item.id"
                    @send-first-play-ga="sendGaClickEvent('video')"
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
          </div>
        </template>
      </section>
    </section>
  </ShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { handleLineBreak, handleApiData } from '~/utils/content-handler'
import { getContactImageUrl } from '~/utils/image-handler'
import { sendGaEvent } from '~/utils/google-analytics'
import ShowWrapper from '~/components/ShowWrapper'
import UiHostList from '~/components/UiHostList'
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
          squareHostImg: true,
        }
      },
      update(data) {
        if (!data.allShows?.[0]?.name) {
          this.has404Err = true
        }
        this.initShowList(data)
        return data.allShows?.[0] || {}
      },
    },
  },
  components: {
    ShowWrapper,
    UiHostList,
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
  },
  data() {
    return {
      show: {},
      playlists: [],
      innerWidth: 0,
      isActive: true,
      has404Err: false,
    }
  },
  head() {
    const title = this.showName ? `${this.showName} - ${SITE_NAME}` : SITE_NAME
    const image = this.show?.picture?.urlDesktopSized
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
.show__main {
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
  &__collect {
    width: 100%;
    margin: 12px 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
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
  &__button__wrapper {
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
}
</style>
