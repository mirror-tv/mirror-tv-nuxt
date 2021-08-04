<template>
  <ArtShowWrapper
    :currentSection="currentSection"
    gaCategory="ArtShow_series"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowBreadCrum="true"
    :section="section"
    :series="series"
  >
    <section class="artshow__series">
      <main class="artshow__series__info">
        <p v-for="(content, i) in introList" :key="`${content}-${i}`">
          {{ content }}
        </p>
      </main>
      <div v-if="shouldShowArtShowList" class="artshow__series__list">
        <h3>所有影片</h3>
        <ArtShowVideoList
          :artShowList="artShowList"
          :currentShow="currentShow"
          :showLoadMoreButton="showLoadMoreButton"
          @click-more-button="handleClickMore"
          @click-video="sendGaClickEvent('單元影片')"
        />
      </div>
    </section>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArtShowWrapper from '~/components/ArtShowWrapper'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchSectionBySlug } from '~/apollo/queries/section.gql'
import { fetchSeriesBySlug } from '~/apollo/queries/series.gql'
import { fetchAllArtShowsBySeries } from '~/apollo/queries/artShow.gql'

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
    section: {
      query: fetchSectionBySlug,
      variables() {
        return {
          slug: this.currentSection,
        }
      },
      update: (data) => data.allSections?.[0] || {},
    },
    series: {
      query: fetchSeriesBySlug,
      variables() {
        return {
          slug: this.currentSeries,
        }
      },
      update: (data) => data.allSeries?.[0] || {},
    },
    artShowList: {
      query: fetchAllArtShowsBySeries,
      variables() {
        return {
          seriesSlug: this.currentSeries,
          first: 8,
          skip: 0,
        }
      },
      update(data) {
        this.artShowCount = data?._allArtShowsMeta?.count
        return data.allArtShows || []
      },
    },
  },
  components: {
    ArtShowWrapper,
    ArtShowVideoList,
  },
  data() {
    return {
      show: {},
      section: {},
      series: {},
      artShowList: [],
      page: 0,
      artShowCount: 0,
    }
  },
  head() {
    const title = `${this.sectionName} - ${this.showName} - ${SITE_NAME}`
    const image = this.series?.heroImage?.urlDesktopSized
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
    currentShow() {
      return this.$route.params.slug ?? ''
    },
    currentSection() {
      return this.$route.params.section ?? ''
    },
    currentSeries() {
      return this.$route.params.series ?? ''
    },
    showName() {
      return this.show.name ?? ''
    },
    sectionName() {
      return this.section.name ?? ''
    },
    introList() {
      const intro = this.series.introduction
      const constentList = []
      const blocks = JSON.parse(intro)?.draft?.blocks ?? []
      blocks.forEach((item) => {
        constentList.push(item.text)
      })
      return constentList
    },
    introduction() {
      return this.introList?.join('') ?? ''
    },
    showLoadMoreButton() {
      return this.artShowList?.length < this.artShowCount
    },
    shouldShowArtShowList() {
      return this.artShowList && this.artShowList?.length
    },
  },
  methods: {
    handleClickMore() {
      this.page++
      this.sendGaClickEvent('load more')
      this.$apollo.queries.artShowList.fetchMore({
        variables: {
          seriesSlug: this.currentSeries,
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
      sendGaEvent(this.$ga)('ArtShow_series')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow__series {
  margin: 16px 0 0;
  @include media-breakpoint-up(md) {
    margin: 20px 0 0;
  }
  &__info {
    margin: 0 0 40px;
    p {
      font-size: 16px;
      line-height: 1.8;
      & + & {
        margin: 16px 0 0;
      }
    }
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
  }
  &__list {
    h3 {
      font-size: 18px;
      font-weight: 500;
      line-height: 15px;
      color: $color-blue;
      margin-bottom: 20px;
      @include media-breakpoint-up(md) {
        font-size: 20px;
        line-height: 1.6;
      }
    }
  }
}
</style>
