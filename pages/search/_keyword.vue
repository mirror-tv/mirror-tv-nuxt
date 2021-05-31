<template>
  <section class="g-page">
    <div class="g-page__wrapper">
      <SearchNoResult v-if="noSearchResult" :keyword="$route.params.keyword" />

      <div v-else class="search-result">
        <h1 class="search-result__name" v-text="$route.params.keyword" />
        <ol class="search-result__list">
          <li
            v-for="post in listData"
            :key="post.id"
            class="search-result__list__item"
          >
            <ArticleCard
              :href="post.href"
              :articleImgURL="post.articleImgURL"
              :articleTitle="post.articleTitle"
              :articleTitleStyle="'bold'"
              :articleTitleHighlightText="keywordDecoded"
              :articleDescription="post.articleDescription"
              :articleDate="post.articleDate"
              :mobileLayoutDirection="'column'"
              @click.native="sendGaClickEvent('related articles')"
            />
          </li>
          <div class="position-correct" />
        </ol>
      </div>

      <ButtonLoadmore
        v-show="showLoadMoreButton"
        class="g-button-load-more"
        @click.native="handleClickMore"
      />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import SearchNoResult from '~/components/SearchNoResult.vue'
import { getImageUrl } from '~/utils/post-image-handler'

export default {
  components: {
    ArticleCard,
    ButtonLoadmore,
    SearchNoResult,
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 12,
      listDataTotal: undefined,
    }
  },

  async fetch() {
    const query = this.keywordDecoded
    let response

    try {
      response = await this.$axios.$post('/api/search', {
        query,
        from: 0,
        size: this.listDataMaxResults,
      })
    } catch (err) {
      //   console.log('err happended when fetching search respond', err)
    }
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  head() {
    const title = `${this.$route.params.keyword} - ${SITE_NAME}`
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
      ],
    }
  },
  computed: {
    keywordDecoded() {
      return decodeURI(this.$route.params.keyword)
    },
    showLoadMoreButton() {
      return (
        this.listDataMaxResults * this.listDataCurrentPage < this.listDataTotal
      )
    },
    noSearchResult() {
      return !this.listData.length > 0
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      const source = item._source
      return {
        id: source.id,
        href: `/story/${source.slug}`,
        articleImgURL: getImageUrl(source),
        articleTitle: source.name,
        articleDescription: this.stripHtmlTag(source.brief),
        articleDate: new Date(source.publishTime),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('search')('click')(label)
    },
    setListData(response = {}) {
      let listData = response?.body?.hits?.hits ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.data?.body?.hits?.total?.value ?? 0
    },
    async handleClickMore() {
      const query = this.keywordDecoded
      const response = await axios.post('/api/search', {
        query,
        from: this.listDataMaxResults * this.listDataCurrentPage,
        size: this.listDataMaxResults,
      })
      this.setListData(response)
      this.listDataCurrentPage += 1
      this.sendGaClickEvent('more')
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page__wrapper {
  @include media-breakpoint-up(md) {
    display: block;
  }
}
.search-result {
  &__name {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0.5px;
    color: $color-blue-deep;
    margin: 24px 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 24px;
    }
  }
  &__list {
    @include media-breakpoint-up(md) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &::after {
        content: '';
        width: calc((100% - 40px) / 3);
      }
      .position-correct {
        width: calc((100% - 40px) / 3);
        overflow: hidden;
      }
    }
    @include media-breakpoint-up(xl) {
      &::after {
        content: '';
        width: calc((100% - 96px) / 4);
      }
      .position-correct {
        width: calc((100% - 96px) / 4);
        overflow: hidden;
      }
    }
    @include media-breakpoint-up(xxl) {
      &::after {
        content: '';
        width: calc((100% - 48px) / 4);
      }
      .position-correct {
        width: calc((100% - 48px) / 4);
        overflow: hidden;
      }
    }
    &__item {
      margin-bottom: 24px;
      @include media-breakpoint-up(md) {
        width: calc((100% - 40px) / 3);
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
      }
      @include media-breakpoint-up(xxl) {
        width: calc((100% - 48px) / 4);
      }
    }
  }
}
</style>
