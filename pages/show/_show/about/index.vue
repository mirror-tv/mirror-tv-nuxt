<template>
  <ArtShowWrapper
    currentSection="about"
    gaCategory="ArtShow_main"
    :currentShow="currentShow"
    :showName="show.name"
    :bannerImg="show.bannerImg"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <section class="artshow__about">
      <section class="artshow__about__collect">
        <ArtShowVideoList
          v-if="artShowList && artShowList.length"
          :artShowList="artShowList"
          :currentShow="currentShow"
          :handleClickMore="handleClickMore"
        />
      </section>
    </section>
  </ArtShowWrapper>
</template>

<script>
import ArtShowWrapper from '~/components/ArtShowWrapper.vue'
import ArtShowVideoList from '~/components/ArtShowVideoList'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchAllArtShowsByShowLatest } from '~/apollo/queries/artShow.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentShow,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
    sectionList: {
      query: fetchSectionByShowSlug,
      variables() {
        return {
          showSlug: this.currentShow,
        }
      },
      update: (data) => data.allSections || {},
    },
    artShowList: {
      query: fetchAllArtShowsByShowLatest,
      variables() {
        return {
          first: 8,
          skip: 0,
          show: this.show.name,
        }
      },
      update: (data) => {
        // this.artShowCount = data?._allArtShowsMeta?.count
        return data.allArtShows || {}
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
      sectionList: [],
      showLoadMoreButton: true,
    }
  },
  computed: {
    currentShow() {
      return this.$route.params.show ?? ''
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
