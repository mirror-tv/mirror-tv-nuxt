<template>
  <section class="g-page g-page--with-aside">
    <div class="g-page__wrapper">
      <main class="main">
        <div v-if="hasListArticleMainData" class="list-latest-wrapper">
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
          class="aside__list-popular"
          :listTitle="'熱門新聞'"
          :listData="listArticleAsidepopularData"
          :hasBorderInXl="true"
        />
        <!-- <ClientOnly>
          <div v-if="!isTablet && microAdId" class="micro-ad">
            <MicroAd :unitId="microAdId" />
          </div>
        </ClientOnly> -->
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'即時新聞'"
          :listData="listArticleAsideLatestData"
          :hasBorderInXl="true"
        />
      </aside>
      <!-- <ClientOnly>
        <div v-if="isTablet && microAdId" class="micro-ad">
          <MicroAd :unitId="microAdId" />
        </div>
      </ClientOnly> -->
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { SITE_NAME, FILTERED_SLUG } from '~/constants'
// import { MICRO_AD_UNITS } from '~/constants/micro-ad'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCardFeatured from '~/components/ArticleCardFeatured'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore'
import ListArticleAside from '~/components/ListArticleAside'
// import MicroAd from '~/components/MicroAd'
import { allPublishedPostsByCategorySlug } from '~/apollo/queries/allPublishedPostsByCategorySlug.gql'
import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'
import { getPostImageUrl } from '~/utils/image-handler'

// const MICRO_AD_INDEXES = [3, 5, 9, 11]

export default {
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
      update(data) {
        const hasCategory = data.allCategories?.some(
          (category) => category.slug === this.pageSlug
        )
        if (!hasCategory) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return data.allCategories
      },
    },
    allPostsCategory: {
      query: allPublishedPostsByCategorySlug,
      variables() {
        return {
          categorySlug: this.pageSlug,
          filteredSlug: this.filteredSlug,
          withCount: true,
          first: this.getPageSize(),
          skip: 0,
        }
      },
      update(data) {
        if (process.browser) {
          this.innerWidth = window.innerWidth
        }
        // this.postsCount = data._allPostsMeta?.count - MICRO_AD_INDEXES.length
        this.postsCount = data._allPostsMeta?.count
        return data.allPostsCategory
      },
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5,
        filteredSlug: FILTERED_SLUG,
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
    // MicroAd,
  },
  data() {
    return {
      page: 0,
      allCategories: [],
      allPostsCategory: [],
      allPostsLatest: [],
      popularData: {},
      postsCount: 0,
      has404Err: false,
      innerWidth: 0,
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchGcsData('/popularlist')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  },
  head() {
    const title = this.pageName ? `${this.pageName} - ${SITE_NAME}` : SITE_NAME
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
      ],
    }
  },
  computed: {
    ...mapGetters({
      topPosts: 'category/displayedTopPosts',
    }),
    currentTopPost() {
      const data = this.topPosts?.[this.pageName] ?? {}
      const sortedData = _.sortBy(data, 'publishTime') ?? []
      return sortedData[0] ?? {}
    },
    currentTopPostSlug() {
      return this.currentTopPost?.slug ?? ''
    },
    filteredSlug() {
      const slugs = FILTERED_SLUG
      if (this.currentTopPostSlug) {
        slugs.push(this.currentTopPostSlug)
      }
      return slugs
    },
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
      const listData = this.currentTopPostSlug
        ? [this.currentTopPost].concat(this.allPostsCategory)
        : this.allPostsCategory
      const reducedList = listData?.map((post) => this.reducerArticleCard(post))
      return reducedList
      // return this.innerWidth ? this.insertMicroAds(reducedList) : reducedList
    },
    hasListArticleMainData() {
      return this.listArticleMainData.length
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
      return this.allPostsCategory?.length < this.postsCount
    },
    // microAdId() {
    //   if (this.innerWidth) {
    //     return this.innerWidth >= 1200 ? '4300419' : '4300420'
    //   }
    //   return ''
    // },
    // isTablet() {
    //   return this.innerWidth >= 768 && this.innerWidth < 1200
    // },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: getPostImageUrl(post),
        articleTitle: post.name,
        articleStyle: post.style,
        articleDate: new Date(post.publishTime),
      }
    },
    // insertMicroAds(listData) {
    //   const insertedListData = [...listData]
    //   const device = this.innerWidth < 768 ? 'MB' : 'PC'
    //   const unitList = MICRO_AD_UNITS.HOME_CATEGORY[device]
    //   const microAdList = MICRO_AD_INDEXES.map((item, i) => {
    //     const unit = unitList.find(
    //       (unit) => unit.name === `NA${i + 1}_${device}_HP`
    //     )
    //     return unit
    //       ? {
    //           insertIndex: item,
    //           unitId: unit.id,
    //         }
    //       : {
    //           insertIndex: item,
    //           unitId: '',
    //         }
    //   })
    //   microAdList.forEach((item, i) => {
    //     if (insertedListData[item.insertIndex - 1]) {
    //       insertedListData.splice(item.insertIndex, 0, {
    //         isMicroAd: true,
    //         microAdId: item.unitId,
    //         id: `micro-ad-${i}`,
    //       })
    //     }
    //   })
    //   return insertedListData
    // },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('category')('click')(label)
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPostsCategory.fetchMore({
        variables: {
          categorySlug: this.pageSlug,
          filteredSlug: this.filteredSlug,
          withCount: false,
          first: 12,
          skip: 12 * this.page,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.allPostsCategory
          return {
            allPostsCategory: [...previousResult.allPostsCategory, ...newPosts],
            _allPostsMeta: {
              __typename: '_QueryMeta',
              count: this.postsCount,
            },
          }
        },
      })
      this.sendGaClickEvent('more')
    },
    getPageSize() {
      return this.currentTopPostSlug ? 12 : 13
      // return this.currentTopPostSlug ? 8 : 9
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
    margin: 0 0 16px 0;
    @include media-breakpoint-up(md) {
      width: calc((100% - 90px) / 3);
      margin: 20px 15px 0;
      ::v-deep {
        .article-img-wrapper.shrink {
          width: 100%;
          min-width: none;
          height: auto;
          padding-top: 66.66%;
        }
        .bottom-wrapper.row-mobile {
          flex-direction: column;
        }
        .info-wrapper {
          margin: 0;
        }
      }
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
    margin-bottom: 32px;
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
    padding: 0;
    margin-top: 60px;

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

  &__list-latest,
  &__list-popular {
    margin-top: 48px;
    // tablet range
    @include media-breakpoint-up(md) {
      width: 50%;
      &:first-child {
        margin-right: 16px;
      }
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      width: 100%;
      margin-top: 0;

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

.micro-ad {
  margin: 40px 0;
  @include media-breakpoint-up(mb) {
    margin: 0;
  }
  @include media-breakpoint-up(xl) {
    margin: 48px 0;
  }
}
</style>
