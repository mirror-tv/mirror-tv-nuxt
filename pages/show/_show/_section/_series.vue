<template>
  <ArtShowWrapper
    :currentSection="currentSection"
    gaCategory="ArtShow_directorlist"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="false"
  >
    <ArtShowBreadCrum :section="section" :series="series" />
    <section class="artshow__series">
      <main>
        <p v-for="content in introductionContent" :key="content">
          {{ content }}
        </p>
      </main>
      <section>
        <h3>所有影片</h3>
        <ArtShowVideoList
          :showList="showList"
          :currentShow="currentShow"
          :showLoadMoreButton="showLoadMoreButton"
          :handleClickVideo="handleClickVideo"
          :handleClickMore="handleClickMore"
        />
      </section>
    </section>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import ArtShowWrapper from '~/components/ArtShowWrapper'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchSectionBySlug } from '~/apollo/queries/section.gql'
import { fetchSeriesBySlug } from '~/apollo/queries/series.gql'
import ArtShowBreadCrum from '~/components/ArtShowBreadCrum'

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
    section: {
      query: fetchSectionBySlug,
      variables() {
        return {
          slug: this.$route.params.page,
        }
      },
      update: (data) => data.allSections?.[0] || {},
    },
    series: {
      query: fetchSeriesBySlug,
      variables() {
        return {
          slug: this.$route.params.series,
        }
      },
      update: (data) => data.allSeries?.[0] || {},
    },
  },
  components: {
    ArtShowWrapper,
    ArtShowVideoList,
    ArtShowBreadCrum,
  },
  data() {
    return {
      show: {},
      section: {},
      series: {},
      showList: [
        {
          name:
            '【特偵名檢涉詐財1】林益世栽在他手上　特偵名檢進豐遭控詐建商3億',
        },
      ],
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
    currentShow() {
      return this.$route.params.show ?? ''
    },
    currentSection() {
      return this.$route.params.page ?? ''
    },
    introductionContent() {
      const intro = this.series.introduction
      const constentList = []
      JSON.parse(intro).draft.blocks.forEach((item) => {
        constentList.push(item.text)
      })
      return constentList
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow__series {
  main {
    margin-bottom: 40px;
    @include media-breakpoint-up(md) {
      margin-bottom: 48px;
    }
  }
  p {
    font-size: 16px;
    line-height: 28px;
    & + p {
      margin-top: 1rem;
    }
  }
  h3 {
    font-weight: 500;
    font-size: 20px;
    line-height: 160%;
    letter-spacing: 0.5px;
    color: $color-blue;
    margin-bottom: 20px;
  }
}
</style>
