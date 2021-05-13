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
                :articleStyle="post.articleStyle"
                @click.native="sendGaClickEvent('category latest')"
              />
              <ArticleCard
                v-else
                :href="post.href"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
                :articleStyle="post.articleStyle"
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
      <aside class="g-aside aside">
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'最新新聞'"
          :listData="listArticleAsideLatestData"
        />

        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'熱門新聞'"
          :listData="listArticleAsidepopularData"
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

import { getImageUrl } from '~/utils/post-image-handler'
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
      allCategories: [],
      allPostsCategory: [],
      allPostsCategoryMeta: [],
      allPostsLatest: [],
      popularData: {},
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchPopularListData()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
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
    listArticleAsidepopularData() {
      const listData = this.popularData?.report ?? []
      return listData
        .filter((item, i) => i < 5)
        .map((report) => this.reducerArticleCard(report))
    },
    showLoadMoreButton() {
      return this.allPostsCategory?.length < this.allPostsCategoryMeta?.count
    },
  },
  methods: {
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: getImageUrl(post),
        articleTitle: post.name,
        articleStyle: post.style,
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
    width: calc(100% + 30px);
    transform: translateX(-15px);
    margin: 0 0 32px;
  }
  li {
    margin: 0 0 20px 0;
    @include media-breakpoint-up(md) {
      width: calc((100% - 90px) / 3);
      margin: 20px 15px 0;
    }
    @include media-breakpoint-up(xl) {
      ::v-deep {
        .article-card {
          width: 100%;
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

.aside {
  // tablet range
  @include media-breakpoint-up(md) {
    width: 688px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;

    > * {
      + * {
        margin-top: 0;
      }
    }
  }

  // desktop range
  @include media-breakpoint-up(xl) {
    width: 384px;
    display: block;
    margin-top: 32px;
    padding: 0;

    // background-color: $color-grey;

    > * {
      + * {
        margin-top: 16px;
      }
    }

    ::v-deep {
      .list__list-item {
        .article-img {
          background-color: #fff;
        }
      }
    }
  }

  &__list-latest {
    // tablet range
    @include media-breakpoint-up(md) {
      &:first-child {
        margin-right: 16px;
      }
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      border: 1px solid $color-grey-deep;

      &:first-child {
        margin-right: 0;
      }
    }
  }

  & .list-title {
    margin-top: 30px !important;
  }
}

.g-button-load-more {
  @include media-breakpoint-up(md) {
    margin: 0 auto;
  }
}
</style>
