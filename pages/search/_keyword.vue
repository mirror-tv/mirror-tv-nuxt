<template>
  <section class="page">
    <div class="max-width-wrapper">
      <div class="list-latest-wrapper">
        <h1 class="title" v-text="$route.params.keyword" />
        <ol class="list-latest">
          <li
            v-for="post in listData"
            :key="post.id"
            class="list-latest__list-item list-latest-list-item"
          >
            <ArticleCard
              :href="post.href"
              :articleImgURL="post.articleImgURL"
              :articleTitle="post.articleTitle"
              :articleTitleStyle="'bold'"
              :articleTitleHighlightText="$route.params.keyword"
              :articleDescription="post.articleDescription"
              :articleDate="post.articleDate"
              :mobileLayoutDirection="'column'"
            />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
import ArticleCard from '~/components/ArticleCard'

export default {
  components: {
    ArticleCard
  },
  async fetch() {
    const query = this.$route.params.keyword
    const response = await this.$axios.post('/api/search', { query })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined
    }
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
        articleTitle: source.title,
        articleDescription: this.stripHtmlTag(source.brief),
        articleDate: new Date(source.publishTime)
      }
    },
    setListData(response = {}) {
      let listData = response.data?.body?.hits?.hits ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.data?.body?.hits?.total?.value ?? 0
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
  min-height: 100vh;
}

.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 20px 50px 20px;
  padding-top: calc(130px + 13px);
  @include media-breakpoint-up(xl) {
    padding: 30px 0 60px 0;
    max-width: calc(180px * 4 + 21px * 3);
    margin: 0 auto;
    flex-direction: row;
  }
}

.title {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0.48px;
    color: #014db8;
  }
}

.list-latest-wrapper {
  display: flex;
  flex-direction: column;
  &__button-load-more {
    align-self: center;
    margin: 30px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 110px 0 0 0;
    }
  }
}

.list-latest {
  margin: 20px 0 0 0;
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0 -26px -21px;
  }
  li {
    margin: 0 0 20px 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 26px 21px;
    }
  }
}
</style>
