<template>
  <ArtShowWrapper
    :currentPage="currentPage"
    gaCategory="ArtShow_directorlist"
    :currentSlug="currentSlug"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="false"
    :section="section"
    :series="series"
  >
  </ArtShowWrapper>
</template>

<script>
import ArtShowWrapper from '~/components/ArtShowWrapper'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchSectionBySlug } from '~/apollo/queries/section.gql'
import { fetchSeriesBySlug } from '~/apollo/queries/series.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentSlug,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
    section: {
      query: fetchSectionBySlug,
      variables() {
        return {
          slug: this.currentPage,
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
  },
  data() {
    return {
      show: {},
      section: {},
      series: {},
    }
  },
  computed: {
    currentSlug() {
      return this.$route.params.slug ?? ''
    },
    currentPage() {
      return this.$route.params.page ?? ''
    },
  },
}
</script>
