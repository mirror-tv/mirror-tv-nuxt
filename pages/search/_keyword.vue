<template>
  <section class="g-page">
    <div class="g-page__wrapper">
      <h1 class="g-list-heading" v-text="$route.params.keyword" />
      <ol class="g-list">
        <li v-for="post in listData" :key="post.id" class="g-list__item">
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
      </ol>
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

export default {
  components: {
    ArticleCard,
    ButtonLoadmore,
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
    const response = await axios.post('/api/search', {
      query,
      from: 0,
      size: this.listDataMaxResults,
    })
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
        articleImgURL: source.heroImage?.urlMobileSized,
        articleTitle: source.name,
        articleDescription: this.stripHtmlTag(source.brief),
        articleDate: new Date(source.publishTime),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('search')('click')(label)
    },
    setListData(response = {}) {
      let listData = response.data?.body?.hits?.hits ?? []
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
.g-page {
  padding-top: calc(130px + 13px);
  @include media-breakpoint-up(xxl) {
    padding-top: 12px;
  }
}
</style>
