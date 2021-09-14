<template>
  <ShowWrapper
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
        :text="directorName"
        class="artshow__director__name"
      />
      <div class="artshow__director__info">
        <img :src="directorImage" :alt="directorName" />
        <HeadingBordered
          v-if="isMobile"
          :text="directorInfo.name"
          class="artshow__director__info-name"
        />
        <div v-if="hasBio" class="artshow__director__info-content">
          <div v-for="paragraph in bio" :key="paragraph.id">
            <!-- eslint-disable vue/no-v-html -->
            <p v-html="paragraph.content" />
          </div>
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
  </ShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleApiData } from '~/utils/content-handler'
import { getContactImageUrl } from '~/utils/image-handler'
import ShowWrapper from '~/components/ShowWrapper'
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
      update(data) {
        const item = data.allShows?.[0] || {}
        if (!item?.name || !item.isArtShow) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return item
      },
    },
    directorInfo: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.$route.params.name,
        }
      },
      update(data) {
        if (!data.allContacts?.[0]?.name) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return data.allContacts?.[0] || {}
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
    ShowWrapper,
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
      has404Err: false,
      page: 0,
    }
  },
  head() {
    const title = `${this.directorInfo.name} - ${SITE_NAME}`
    const image = this.show?.picture?.urlDesktopSized
    const description = this.bio?.[0]?.content ?? ''
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
    showName() {
      return this.show.name ?? ''
    },
    showLoadMoreButton() {
      return this.artShowList?.length < this.artShowCount
    },
    directorName() {
      return this.directorInfo?.name ?? ''
    },
    directorImage() {
      return getContactImageUrl(this.directorInfo) ?? ''
    },
    bio() {
      return this.formatBio(this.directorInfo.bioApiData)
    },
    hasBio() {
      return this.bio.length
    },
    hasArtShowList() {
      return this.artShowList.length
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
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
    formatBio(item) {
      const bios = handleApiData(item)
      return bios.map((item) => {
        return {
          id: item.id || '',
          content: item.content?.[0] || '',
        }
      })
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
        justify-content: space-between;
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
        }
      }
      &-name {
        width: 130px;
        margin: 0 0 24px;
      }
      &-content {
        width: 100%;
        font-size: 16px;
        line-height: 32px;
        @include media-breakpoint-up(md) {
          width: calc(100% - 215px - 32px);
        }
        @include media-breakpoint-up(xl) {
          width: calc(100% - 215px - 92px);
        }
        > * + * {
          margin: 16px 0 0;
        }
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
