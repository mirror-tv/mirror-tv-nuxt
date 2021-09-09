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
      <article class="artshow__series__info">
        <template v-if="isContentString">
          {{ content }}
        </template>
        <template v-else>
          <ArticleContentHandler
            v-for="paragraph in content"
            :key="paragraph.id"
            :paragraph="paragraph"
          />
        </template>
      </article>
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
import { handleApiData } from '~/utils/content-handler'
import ArtShowWrapper from '~/components/ArtShowWrapper'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import ArticleContentHandler from '~/components/ArticleContentHandler'
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
    ArticleContentHandler,
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
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        ...(this.showIntroduction
          ? [
              {
                hid: 'description',
                name: 'description',
                content: this.showIntroduction,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: this.showIntroduction,
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
    content() {
      return handleApiData(this.series.introductionApiData)
    },
    showIntroduction() {
      return this.show?.introduction ?? ''
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
    color: #000;
    font-size: 16px;
    text-align: justify;
    line-height: 1.8;
    ::v-deep {
      > * + * {
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
