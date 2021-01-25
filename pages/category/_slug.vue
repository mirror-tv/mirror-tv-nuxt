<template>
  <section class="g-page g-page--with-aside">
    <div class="g-page__wrapper">
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
                @click.native="sendGaClickEvent('category latest')"
              />
              <ArticleCard
                v-else
                :href="post.href"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
                :mobileLayoutDirection="'column'"
                @click.native="sendGaClickEvent('category latest')"
              />
            </li>
          </ol>
          <ButtonLoadmore
            v-show="showLoadMoreButton"
            class="g-button-load-more"
            @click.native="handleClickMore"
          />
        </div>
      </main>
      <aside class="g-aside">
        <ListArticleAside
          :listTitle="'最新文章'"
          :listData="listArticleAsideLatestData"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'

import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCardFeatured from '~/components/ArticleCardFeatured'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import ListArticleAside from '~/components/ListArticleAside'

import { allPublishedPostsByCategorySlug } from '~/apollo/queries/allPublishedPostsByCategorySlug.gql'
import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'

const pageSize = 13

export default {
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
      result({ data }) {
        const hasCategory = data.allCategories?.some(
          (category) => category.slug === this.pageSlug
        )
        if (!hasCategory) {
          this.$nuxt.error({ statusCode: 404 })
        }
      },
    },
    allPostsCategory: {
      query: allPublishedPostsByCategorySlug,
      variables() {
        return {
          categorySlug: this.pageSlug,
          first: pageSize,
          skip: 0,
        }
      },
    },
    allPostsCategoryMeta: {
      query: allPublishedPostsByCategorySlug,
      variables() {
        return {
          categorySlug: this.pageSlug,
        }
      },
      update: (data) => data.meta,
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5,
      },
      update: (data) => data.allPublishedPosts,
    },
  },
  components: {
    HeadingBordered,
    ArticleCardFeatured,
    ArticleCard,
    ButtonLoadmore,
    ListArticleAside,
  },
  data() {
    return {
      page: 0,
    }
  },
  head() {
    const title = `${this.pageName} - ${SITE_NAME}`
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
    category() {
      return this.allCategories.find(
        (category) => category.slug === this.pageSlug
      )
    },
    pageName() {
      return this.category?.name
    },
    pageSlug() {
      return this.$route.params.slug
    },
    listArticleMainData() {
      const listData = this.allPostsCategory ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },

    listArticleAsideLatestData() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },

    showLoadMoreButton() {
      return pageSize * (this.page + 1) < this.allPostsCategoryMeta?.count
    },
  },
  methods: {
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: post.heroImage?.urlMobileSized,
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('category')('click')(label)
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPostsCategory.fetchMore({
        variables: {
          categorySlug: this.pageSlug,
          first: pageSize,
          skip: pageSize * this.page,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.allPostsCategory
          return {
            allPostsCategory: [...previousResult.allPostsCategory, ...newPosts],
          }
        },
      })
      this.sendGaClickEvent('more')
    },
  },
}
</script>

<style lang="scss" scoped>
.list-latest-wrapper {
  display: flex;
  flex-direction: column;
}

.list-latest-title {
  min-width: 110px;
  width: max-content;
}

.list-latest {
  margin: 20px 0 0 0;
  @include media-breakpoint-up(md) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  li {
    margin: 0 0 20px 0;
    @include media-breakpoint-up(md) {
      width: calc((100% - 52px) / 3);
    }
    @include media-breakpoint-up(xxl) {
      width: calc((100% - 48px) / 3);
      ::v-deep {
        .article-card {
          width: auto;
        }
        .article-img-wrapper.stretch {
          width: 100%;
          height: auto;
        }
      }
    }
    &:first-child {
      width: calc(100% + 32px);
      transform: translateX(-16px);
      @include media-breakpoint-up(md) {
        width: 100%;
        transform: none;
      }
    }
  }
  &-list-item__featured {
    @include media-breakpoint-up(md) {
      flex-direction: row;
      ::v-deep {
        .article-img-wrapper {
          width: 66.66%;
          padding-top: calc(66.66% * 0.6666);
        }
        .info-wrapper {
          flex: 1;
          padding: 30px 18px;
        }
      }
    }
    @include media-breakpoint-up(xxl) {
      width: 100%;
    }
  }
}

.g-aside {
  @include media-breakpoint-up(xxl) {
    padding: 0;
  }
  .list-wrapper {
    padding: 30px 80px;
    border: 1px solid $color-grey-deep;
    @include media-breakpoint-up(xxl) {
      padding: 32px;
    }
  }
}

.g-button-load-more {
  @include media-breakpoint-up(md) {
    margin: 0 auto;
  }
}
</style>
