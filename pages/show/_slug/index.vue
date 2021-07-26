<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <main class="main">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="show__introduction" v-html="introduction" />
        <ol class="host__container">
          <li v-for="host in hosts" :key="host.name">
            <a
              :href="`/anchorperson/${host.slug}`"
              target="_blank"
              rel="noreferrer noopener"
              class="host__wrapper"
            >
              <img
                v-if="host.image"
                v-lazy="host.image.urlMobileSized"
                :alt="host.name"
              />
              <img
                v-else
                v-lazy="require('~/assets/img/image-default.png')"
                alt="default image"
              />
              <div class="host__wrapper-content">
                <h3>主持人｜{{ host.name }}</h3>
                <p v-if="host.bio">{{ host.bio }}</p>
              </div>
            </a>
          </li>
        </ol>
      </main>
      <aside class="g-aside">
        <FacebookPagePlugin v-if="facebookUrl" :href="facebookUrl" />
      </aside>
    </div>
    <div class="g-page__wrapper">
      <template v-if="isMobile">
        <div v-if="validPlaylists.length > 1" class="show__button__wrapper">
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
          class="show__collect"
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
          class="show__collect"
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
    </div>
    <YoutubeToS />
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import YoutubeToS from '~/components/YoutubeToS.vue'
import ButtonLoadmore from '~/components/ButtonLoadmore'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { handleLineBreak } from '~/utils/text-handler'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
      update(data) {
        if (!data.allShows?.[0]?.name) {
          this.has404Err = true
        }
        return data.allShows?.[0] || {}
      },
      result({ data, loading }) {
        if (!loading) {
          const { playList01 = '', playList02 = '' } = data.allShows?.[0] || {}
          const youtubeUrls = [playList01, playList02]
          if (process.browser) {
            this.isMobile = window.innerWidth < 768
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
        }
      },
    },
  },
  components: {
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    ButtonLoadmore,
    YoutubeToS,
  },
  data() {
    return {
      show: {},
      playlists: [],
      isMobile: false,
      isActive: true,
      has404Err: false,
    }
  },
  head() {
    const title = this.showName ? `${this.showName} - ${SITE_NAME}` : SITE_NAME
    const image = this.show?.bannerImg?.urlDesktopSized
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
      return handleLineBreak(this.show.introduction)
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
    firstName() {
      return this.show.playList01?.split('：')[1] ?? '選單 A'
    },
    secondName() {
      return this.show.playList02?.split('：')[1] ?? '選單 B'
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
    async loadYoutubeListData(list) {
      if (list.id) {
        try {
          const pageToken = list.nextPageToken
            ? `&pageToken=${list.nextPageToken}`
            : ''
          const num = this.isMobile ? 2 : 8
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
  padding-bottom: 8px;
  &.g-page--with-aside {
    .g-page__wrapper {
      @include media-breakpoint-up(md) {
        flex-wrap: wrap;
      }
      .main {
        margin: 24px auto 0;
        @include media-breakpoint-up(md) {
          width: 308px;
          margin: 24px 0 0;
        }
        @include media-breakpoint-up(xl) {
          width: 600px;
        }
      }
      .g-aside {
        width: 100%;
        margin: 48px auto 0;
        @include media-breakpoint-up(md) {
          width: 320px;
          padding: 0;
          margin: 24px 0 0 auto;
        }
        @include media-breakpoint-up(xxl) {
          width: 320px;
          padding: 0;
        }
      }
    }
  }
  &__banner-image {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    margin: 0 auto;
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
    font-size: 16px;
    line-height: 32px;
    margin-bottom: 24px;
    @include media-breakpoint-up(md) {
      margin-bottom: 48px;
    }
  }
  &__collect {
    margin-top: 12px;
    @include media-breakpoint-up(md) {
      margin-top: 24px;
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

.host {
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
        line-height: 22px;
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
    &:hover h3 {
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }
}
</style>
