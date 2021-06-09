<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="showName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <ArtShowNavbar
        v-if="shouldShowNavbar"
        :currentSlug="currentSlug"
        :currentPage="currentPage"
      />
      <ArtShowBreadCrum v-else />

      <About
        v-if="currentPage === 'about'"
        :isMobile="isMobile"
        :introduction="introduction"
        :trailerList="validPlaylist"
        :showList="showList"
        :facebookUrl="facebookUrl"
        :currentSlug="currentSlug"
      />

      <Team v-else-if="currentPage === 'team'" :currentSlug="currentSlug" />

      <SingleShow v-else />
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import ArtShowNavbar from '~/components/ArtShowNavbar'
import ArtShowBreadCrum from '~/components/ArtShowBreadCrum'
import About from '~/components/ArtShow/About'
import Team from '~/components/ArtShow/Team'
import SingleShow from '~/components/ArtShow/SingleShow'
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
  },
  components: {
    ArtShowNavbar,
    ArtShowBreadCrum,
    About,
    Team,
    SingleShow,
  },
  data() {
    return {
      show: {},
      trailerList: {},
      showList: [
        { id: 'BUXE8PD2GPA', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'dSwrzQ_IC-c', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'o51cN-oxm0o', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'M80b1NEnkaM', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: '-vPm2G_EIb0', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'qqCNEFk0tx0', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'OamEy6MbC7s', title: '栽在他手上特偵名檢', img: 'tt' },
      ],
      isMobile: false,
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
    currentSlug() {
      return this.$route.params.slug ?? ''
    },
    currentPage() {
      return this.$route.params.page ?? ''
    },
    shouldShowNavbar() {
      return this.currentPage === 'about' || this.currentPage === 'team'
    },
    showName() {
      return this.show.name ?? ''
    },
    picture() {
      return this.show.picture
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
    validPlaylist() {
      return this.trailerList?.items?.length ? this.trailerList : {}
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
      @include media-breakpoint-up(xl) {
        max-width: 1120px;
        display: flex;
        flex-wrap: wrap;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1200px;
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
      margin: 9px auto 34px;
      transform: none;
    }
    @include media-breakpoint-up(xl) {
      margin: 24px auto 34px;
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
}
</style>
