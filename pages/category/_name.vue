<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
        <div class="list-latest-wrapper">
          <HeadingBordered class="list-latest-title" :text="pageName" />
          <ol class="list-latest">
            <li
              v-for="(post, i) in listArticleMainData"
              :key="post.id"
              class="list-latest__list-item list-latest-list-item"
            >
              <ArticleCardFeatured
                v-if="i === 0"
                class="list-latest-list-item__featured"
                :href="post.href"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
              />
              <ArticleCard
                v-else
                :href="post.href"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
                :mobileLayoutDirection="'column'"
              />
            </li>
          </ol>
          <ButtonLoadmore
            v-show="showLoadMoreButton"
            class="list-latest-wrapper__button-load-more button-load-more"
            @click.native="handleClickMore"
          />
        </div>
      </main>
      <aside class="aside">
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'最新文章'"
          :listData="listArticleAsideLatestData"
          :moreTo="listArticleAsideLatestMoreTo"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCardFeatured from '~/components/ArticleCardFeatured'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import ListArticleAside from '~/components/ListArticleAside'

import allPublishedPostsByCategoryTitle from '~/apollo/queries/allPublishedPostsByCategoryTitle.gql'
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'

const pageSize = 13

export default {
  apollo: {
    allPostsCategory: {
      query: allPublishedPostsByCategoryTitle,
      variables() {
        return {
          categoryTitle: this.pageName,
          first: pageSize,
          skip: 0
        }
      }
    },
    allPostsCategoryMeta: {
      query: allPublishedPostsByCategoryTitle,
      variables() {
        return {
          categoryTitle: this.pageName
        }
      },
      update: (data) => data.meta
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5
      },
      update: (data) => data.allPublishedPosts
    },
    allPostsLatestMeta: {
      query: allPublishedPosts,
      update: (data) => data.meta
    }
  },
  components: {
    HeadingBordered,
    ArticleCardFeatured,
    ArticleCard,
    ButtonLoadmore,
    ListArticleAside
  },
  data() {
    return {
      page: 0
    }
  },
  computed: {
    pageName() {
      return this.$route.params.name
    },

    listArticleMainData() {
      const listData = this.allPostsCategory ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },

    showListArticleAsideLatest() {
      return this.allPostsLatestMeta.count > 5
    },
    listArticleAsideLatestMoreTo() {
      return this.showListArticleAsideLatest ? '/latest' : undefined
    },
    listArticleAsideLatestData() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },

    showLoadMoreButton() {
      return pageSize * (this.page + 1) < this.allPostsCategoryMeta?.count
    }
  },
  methods: {
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: post.heroImage?.urlMobileSized,
        articleTitle: post.title,
        articleDate: new Date(post.publishTime)
      }
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPostsCategory.fetchMore({
        variables: {
          categoryTitle: this.pageName,
          first: pageSize,
          skip: pageSize * this.page
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.allPostsCategory
          return {
            allPostsCategory: [...previousResult.allPostsCategory, ...newPosts]
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
  min-height: 100vh;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 380;
$mainWidthDesktop: $maxWidthDesktop - $asideWidthDesktop;
.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 80px 20px 50px 20px;
  @include media-breakpoint-up(xl) {
    padding: 0;
    max-width: #{$maxWidthDesktop}px;
    margin: 0 auto;
    flex-direction: row;
  }
}

.main {
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 60px 0 50px 0;
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

.list-latest-title {
  min-width: 110px;
  width: max-content;
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
    &:first-child {
      width: 100vw;
      position: relative;
      left: -20px;
      @include media-breakpoint-up(xl) {
        width: auto;
        left: 0;
      }
    }
  }
}

.button-load-more {
  width: 100%;
  @include media-breakpoint-up(xl) {
    width: 300px;
  }
}

.aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 60px 0;
  }
  &__list-latest {
    margin: 30px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 0;
    }
  }
}
</style>
