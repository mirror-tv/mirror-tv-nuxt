<template>
  <ArtShowWrapper
    currentSection="director"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
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
          src="~assets/img/image-default.jpg"
          :alt="directorInfo.name"
        />
        <HeadingBordered
          v-if="isMobile"
          :text="directorInfo.name"
          class="artshow__director__info-name"
        />
        <div v-if="hasBios">
          <p
            v-for="(bio, i) in bios"
            :key="`${bio}-${i}`"
            class="artshow__director__info-bio"
          >
            {{ bio }}
          </p>
        </div>
      </div>
      <div v-if="hasArtShowList" class="artshow__director__collect">
        <h3>作品列表</h3>
        <ClientOnly>
          <ArtShowVideoList
            :artShowList="artShowList"
            :currentShow="currentShow"
            :showLoadMoreButton="showLoadMoreButton"
            @click-more-button="handleClickMore"
            @click-video="sendGaClickEvent('作品列表的一支影片')"
          />
        </ClientOnly>
      </div>
    </section>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArtShowWrapper from '~/components/ArtShowWrapper.vue'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import HeadingBordered from '~/components/HeadingBordered'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchContactBySlug } from '~/apollo/queries/contact.gql'
import { fetchAllArtShowsByAuthor } from '~/apollo/queries/artShow.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'

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
    directorInfo: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.$route.params.name,
        }
      },
      update: (data) => data.allContacts?.[0] || {},
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
      query: fetchAllArtShowsByAuthor,
      variables() {
        return {
          authorSlug: this.$route.params.name,
          showSlug: this.currentShow,
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
      sectionList: [],
      artShowList: [],
      artShowCount: 0,
      isMobile: false,
      page: 0,
    }
  },
  head() {
    const title = `${this.directorInfo.name} - ${SITE_NAME}`
    const image = this.show?.picture?.urlDesktopSized
    return {
      title,
      description: this.directorInfo.bio,
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
      return this.$route.params.slug ?? ''
    },
    showName() {
      return this.show.name ?? ''
    },
    showLoadMoreButton() {
      return this.artShowList?.length < this.artShowCount
    },
    bios() {
      return this.directorInfo.bio?.split('\n') ?? []
    },
    hasBios() {
      return this.bios.length
    },
    hasArtShowList() {
      return this.artShowList.length
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
      this.page++
      this.sendGaClickEvent('load more')
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
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ArtShow_director')('click')(label)
    },
  },
}
</script>
<style lang="scss" scoped>
.artshow {
  &__director {
    width: 100%;
    margin: 48px 0 0;
    @include media-breakpoint-up(md) {
      margin: 48px 0 40px;
    }
    @include media-breakpoint-up(xl) {
      margin: 48px 0 70px;
    }
    &__name {
      max-width: 200px;
      @include media-breakpoint-up(md) {
        margin: 0 0 24px;
      }
    }
    &__info {
      width: 100%;
      margin: 0 0 48px;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-direction: row-reverse;
      }
      @include media-breakpoint-up(xl) {
        margin: 0 0 72px;
      }
      img {
        width: 100%;
        height: calc(100vw - 32px);
        object-fit: cover;
        object-position: center;
        background-color: $color-grey;
        margin: 0 0 16px;
        @include media-breakpoint-up(md) {
          width: 215px;
          height: 215px;
          margin: 0 0 0 32px;
        }
        @include media-breakpoint-up(xl) {
          margin: 0 0 0 92px;
        }
      }
      p {
        font-weight: 500;
        font-size: 16px;
        line-height: 32px;
        color: #004dbc;
        flex: 1;
      }
      p + p {
        margin-top: 24px;
      }
      &-name {
        width: 130px;
        margin: 0 0 24px;
      }
    }
    &__collect {
      h3 {
        font-size: 18px;
        font-weight: 500;
        line-height: 25px;
        color: $color-blue;
        margin: 0 0 20px;
        @include media-breakpoint-up(md) {
          font-size: 20px;
          line-height: 1.6;
          letter-spacing: 0.5;
        }
      }
    }
  }
}
</style>
