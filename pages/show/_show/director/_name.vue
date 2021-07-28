<template>
  <ArtShowWrapper
    currentSection="director"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="false"
  >
    <section class="artshow__director">
      <HeadingBordered
        v-if="!isMobile"
        :text="directorInfo.name"
        class="artshow__director__name"
      />
      <div class="artshow__director__info">
        <img
          v-if="directorInfo.image"
          :src="directorInfo.image.urlTabletSized"
          :alt="directorInfo.name"
        />
        <img
          v-else
          src="~assets/img/image-default.png"
          :alt="directorInfo.name"
        />
        <HeadingBordered
          v-if="isMobile"
          :text="directorInfo.name"
          class="artshow__director__info-name"
        />
        <div>
          <p v-for="bio in bios" :key="bio" class="artshow__director__info-bio">
            {{ bio }}
          </p>
        </div>
      </div>
    </section>
    <ArtShowVideoList
      :showList="showList"
      :handleClickMore="handleClickMore"
      :handleClickVideo="handleClickVideo"
      :currentShow="currentShow"
      :showLoadMoreButton="showLoadMoreButton"
    />
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArtShowWrapper from '~/components/ArtShowWrapper.vue'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import HeadingBordered from '~/components/HeadingBordered'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchContactByName } from '~/apollo/queries/contact.gql'
import { fetchAllArtShowsByAuthor } from '~/apollo/queries/artShow.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.$route.params.show,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
    directorInfo: {
      query: fetchContactByName,
      variables() {
        return {
          name: this.$route.params.name,
        }
      },
      result({ data }) {
        this.bios = data.allContacts[0].bio?.split('\n')
      },
      update: (data) => data.allContacts?.[0] || {},
    },
    showList: {
      query: fetchAllArtShowsByAuthor,
      variables() {
        return {
          name: this.$route.params.name,
          first: 8,
          skip: 0,
        }
      },
      result({ data }) {
        this.artShowCount = data._allArtShowsMeta.count
      },
      update: (data) => data.allArtShows || {},
    },
  },
  components: {
    ArtShowVideoList,
    ArtShowWrapper,
    HeadingBordered,
  },
  data() {
    return {
      show: {},
      directorInfo: {},
      showList: [],
      artShowCount: 0,
      isMobile: false,
      page: 0,
      bios: [],
    }
  },
  head() {
    const title = `${this.directorInfo.name} - ${SITE_NAME}`
    const image = this.show?.bannerImg?.urlDesktopSized
    return {
      title,
      description: this.directorInfo.bio,
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
        ...(this.directorInfo.bio
          ? [
              {
                hid: 'description',
                name: 'description',
                content: this.directorInfo.bio,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: this.directorInfo.bio,
              },
            ]
          : []),
      ],
    }
  },
  computed: {
    currentShow() {
      return this.$route.params.show ?? ''
    },
    showName() {
      return this.show.name ?? ''
    },
    picture() {
      return this.show.picture
    },
    showLoadMoreButton() {
      return this.showList?.length < this.artShowCount
    },
  },
  mounted() {
    this.detectViewport()
  },
  methods: {
    detectViewport() {
      const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (viewportWidth < 768) {
        this.isMobile = true
      }
    },
    handleClickMore() {
      sendGaEvent(this.$ga)('ArtShow_director')('click')('load more')
      this.page++
      this.$apollo.queries.showList.fetchMore({
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
      sendGaEvent(this.$ga)('ArtShow_director')('click')('作品列表的一支影片')
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow {
  &__director {
    width: 100%;
    margin-bottom: 55px;
    @include media-breakpoint-up(md) {
      margin-bottom: 45px;
    }
    @include media-breakpoint-up(xl) {
      margin-bottom: 75px;
    }
    &__name {
      width: 130px;
      @include media-breakpoint-up(md) {
        margin-bottom: 26px;
      }
    }
    &__info {
      width: 100%;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-direction: row-reverse;
      }
      img {
        width: 100%;
        height: calc(100vw - 32px);
        object-fit: cover;
        object-position: center;
        background-color: $color-grey;
        margin-bottom: 24px;
        @include media-breakpoint-up(md) {
          width: 215px;
          height: 215px;
          margin: 0 0 0 32px;
        }
        @include media-breakpoint-up(md) {
          margin: 0 0 0 92px;
        }
      }
      p {
        font-weight: 500;
        font-size: 16px;
        line-height: 32px;
        color: $color-blue;
        flex: 1;
      }
      p + p {
        margin-top: 32px;
      }
      &-name {
        width: 130px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
