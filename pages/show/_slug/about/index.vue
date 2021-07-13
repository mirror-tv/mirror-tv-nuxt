<template>
  <ArtShowWrapper
    currentPage="about"
    gaCategory="ArtShow_main"
    :currentSlug="currentSlug"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <section class="artshow__about">
      <section class="artshow__about__collect">
        <ArtShowVideoList
          :showList="showList"
          :handleClickMore="handleClickMore"
          :currentSlug="currentSlug"
          :showLoadMoreButton="showLoadMoreButton"
          :handleClickVideo="handleClickVideo"
        />
      </section>
    </section>
  </ArtShowWrapper>
</template>

<script>
import ArtShowWrapper from '~/components/ArtShowWrapper.vue'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchAllArtShowsByShowLastest } from '~/apollo/queries/artShow.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'

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
    sectionList: {
      query: fetchSectionByShowSlug,
      variables() {
        return {
          showSlug: this.currentSlug,
        }
      },
      update: (data) => data.allSections || {},
    },
    showList: {
      query: fetchAllArtShowsByShowLastest,
      variables() {
        return {
          first: 8,
          skip: 0,
          show: this.show.name,
        }
      },
      result({ data, loading }) {
        if (!loading) {
          this.artShowCount = data?._allArtShowsMeta?.count
          return data.allArtShows
        }
      },
      update: (data) => data.allArtShows || {},
    },
  },
  components: {
    ArtShowWrapper,
    ArtShowVideoList,
  },
  data() {
    return {
      show: {},
      sectionList: [],
      showLoadMoreButton: true,
    }
  },
  computed: {
    currentSlug() {
      return this.$route.params.slug ?? ''
    },
  },
  methods: {
    handleClickMore() {
      this.showLoadMoreButton = false
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow__about {
  width: 100%;
}
</style>
