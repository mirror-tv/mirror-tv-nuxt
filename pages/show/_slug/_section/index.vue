<template>
  <ArtShowWrapper
    :currentSection="currentSection"
    gaCategory="ArtShow_directorlist"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <ol class="series__list">
      <li v-for="seriesGroup in seriesGroups" :key="seriesGroup[0].slug">
        <div
          v-for="series in seriesGroup"
          :key="series.slug"
          class="series__list_item"
          @click="sendGaClickEvent('首圖&標題&前言 整個區塊')"
        >
          <a
            :href="`/show/${currentShow}/${currentSection}/${series.slug}`"
            rel="noreferrer noopener"
          >
            <div class="series__list_item_image">
              <img
                v-if="series.heroImage"
                :src="series.heroImage.urlMobileSized"
                :alt="series.name"
              />
              <img
                v-else
                src="~assets/img/image-default.png"
                :alt="series.name"
              />
            </div>
          </a>
          <a
            :href="`/show/${currentShow}/${currentSection}/${series.slug}`"
            rel="noreferrer noopener"
            class="series__list_item_info"
          >
            <h3>{{ series.name }}</h3>
            <div class="series__list_item_info_content">
              <p
                v-for="content in getIntroContentList(series.introduction)"
                :key="content"
              >
                {{ content }}
              </p>
            </div>
          </a>
        </div>
      </li>
    </ol>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArtShowWrapper from '~/components/ArtShowWrapper'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
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
      result({ data }) {
        data.allSections.forEach((section) => {
          if (section.slug === this.currentSection) {
            this.seriesList = section.series
            this.sectionName = section.name
          }
        })
      },
      update: (data) => data.allSections || {},
    },
  },
  components: {
    ArtShowWrapper,
  },
  data() {
    return {
      show: {},
      sectionName: '',
      sectionList: [],
      seriesList: [],
    }
  },
  head() {
    const title = `${this.sectionName} - ${this.show.name} - ${SITE_NAME}`
    const image = this.show?.bannerImg?.urlDesktopSized
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
        ...(this.show.introduction
          ? [
              {
                hid: 'description',
                name: 'description',
                content: this.show.introduction,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: this.show.introduction,
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
    seriesGroups() {
      const group = []
      for (let i = 0; i < this.seriesList.length; i += 2) {
        group.push(this.seriesList.slice(i, i + 2))
      }
      return group
    },
  },
  methods: {
    getIntroContentList(intro) {
      const constentList = []
      JSON.parse(intro).draft.blocks.forEach((item) => {
        constentList.push(item.text)
      })
      return constentList
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ArtShow_serieslist')('click')(label)
    },
  },
}
</script>
<style lang="scss" scoped>
.series__list {
  width: 100%;
  li {
    width: 100%;
    @include media-breakpoint-up(xl) {
      display: flex;
      justify-content: space-between;
      &:not(:last-child) {
        border-bottom: 1px solid #d8d8d8;
      }
    }
    & .series__list_item {
      padding: 24px 0;
      border-bottom: 1px solid #d8d8d8;
      display: flex;
      flex-direction: column;
      @include media-breakpoint-up(md) {
        padding: 40px 0;
        flex-direction: row;
      }
      @include media-breakpoint-up(xl) {
        padding: 48px 0;
        width: calc((100% - 60px) / 2);
        border: 0;
      }
      &_image {
        overflow: hidden;
        width: 288px;
        height: 162px;
        background: lightgray;
        max-width: 100%;
        @include media-breakpoint-up(md) {
          width: 192px;
          height: 108px;
          margin-right: 24px;
        }
      }
      img {
        @include media-breakpoint-up(md) {
          margin-right: 24px;
        }
      }
      &_info {
        margin-top: 20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        @include media-breakpoint-up(md) {
          margin-top: 0;
        }
        h3 {
          font-weight: 500;
          font-size: 18px;
          line-height: 25px;
          color: $color-blue;
          @include media-breakpoint-up(md) {
            font-size: 20px;
            line-height: 160%;
            letter-spacing: 0.5px;
          }
        }
        &_content {
          margin-top: 12px;
          font-size: 16px;
          line-height: 180%;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          white-space: normal;
          @include media-breakpoint-up(md) {
            -webkit-line-clamp: 4;
            margin-top: 20px;
          }
          @include media-breakpoint-up(xl) {
            -webkit-line-clamp: 3;
          }
        }
      }
    }
    &:last-child .series__list_item:last-child {
      border: 0;
    }
  }
}
</style>
