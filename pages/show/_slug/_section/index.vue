<template>
  <ArtShowWrapper
    :currentSection="currentSectionSlug"
    gaCategory="ArtShow_serieslist"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <ul class="series__list">
      <li
        v-for="series in seriesList"
        :key="series.slug"
        class="series__list_item"
        @click="sendGaClickEvent('首圖&標題&前言 整個區塊')"
      >
        <a
          :href="`/show/${currentShow}/${currentSectionSlug}/${series.slug}`"
          rel="noreferrer noopener"
        >
          <div class="series__list_item_image">
            <img :src="getImage(series)" :alt="series.name" />
          </div>
          <div class="series__list_item_info">
            <h3>{{ series.name }}</h3>
            <div class="series__list_item_info_content">
              <p
                v-for="content in getIntroList(series.introduction)"
                :key="content"
              >
                {{ content }}
              </p>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { getImageUrl } from '~/utils/post-image-handler'
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
      update: (data) => data.allSections || [],
    },
  },
  components: {
    ArtShowWrapper,
  },
  data() {
    return {
      show: {},
      sectionList: [],
    }
  },
  head() {
    const title = `${this.sectionName} - ${this.show.name} - ${SITE_NAME}`
    const image = this.show?.picture?.urlDesktopSized
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
    currentSectionSlug() {
      return this.$route.params.section ?? ''
    },
    currentSection() {
      return (
        this.sectionList.find(
          (item) => item.slug === this.currentSectionSlug
        ) ?? {}
      )
    },
    sectionName() {
      return this.currentSection?.name ?? ''
    },
    seriesList() {
      return this.currentSection?.series ?? []
    },
  },
  methods: {
    getImage(series) {
      return getImageUrl(series)
    },
    getIntroList(intro) {
      const constentList = []
      const blocks = JSON.parse(intro)?.draft?.blocks ?? []
      blocks.forEach((item) => {
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
  margin: 24px 0 0;
  @include media-breakpoint-up(md) {
    margin: 40px 0 0;
  }
  @include media-breakpoint-up(xl) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  &_item {
    @include media-breakpoint-up(xl) {
      width: 50%;
    }
    &_image {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background-color: $color-grey;
      overflow: hidden;
      margin: 0 0 20px;
      @include media-breakpoint-up(md) {
        min-width: 192px;
        max-width: 192px;
        height: 108px;
        padding-top: 0;
        margin: 0 24px 0 0;
      }
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }
    &_info {
      @include media-breakpoint-up(xl) {
        min-width: 314px;
      }
      @include media-breakpoint-up(xxl) {
        min-width: 344px;
      }
      h3 {
        font-size: 18px;
        font-weight: 500;
        line-height: 25px;
        color: $color-blue;
        margin: 0 0 12px;
      }
      &_content {
        p {
          font-size: 16px;
          line-height: 1.8;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          @include media-breakpoint-up(md) {
            -webkit-line-clamp: 4;
          }
          @include media-breakpoint-up(xl) {
            -webkit-line-clamp: 3;
          }
        }
      }
    }
    & + & {
      padding: 24px 0 0;
      margin: 24px 0 0;
      border-top: 1px solid #d8d8d8;
      @include media-breakpoint-up(md) {
        padding: 40px 0 0;
        margin: 40px 0 0;
      }
      @include media-breakpoint-up(xl) {
        padding: 0 0 48px;
        margin: 0 0 48px;
        border-bottom: 1px solid #d8d8d8;
        border-top: none;
      }
    }
    &:first-child {
      @include media-breakpoint-up(xl) {
        padding: 0 0 48px;
        margin: 0 0 48px;
        border-bottom: 1px solid #d8d8d8;
      }
    }
    &:nth-child(odd) {
      @include media-breakpoint-up(xl) {
        padding: 0 60px 48px 0;
      }
    }
    &:last-child,
    &:nth-last-child(2):nth-child(odd) {
      @include media-breakpoint-up(xl) {
        margin: 0;
        border-bottom: none;
      }
    }
    a {
      display: block;
      @include media-breakpoint-up(md) {
        width: 100%;
        display: flex;
      }
    }
  }
}
</style>
