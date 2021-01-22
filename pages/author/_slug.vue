<template>
  <section class="g-page g-page--with-aside">
    <div class="g-page__wrapper">
      <main class="main">
        <ContactBlock
          :name="authorName"
          :image="contactImage"
          :facebook="contact.facebook"
          :instatgram="contact.instatgram"
          :profile="contact.bio"
        />
        <div class="posts-count">所有文章（{{ postsCount }}）</div>
        <ArticleCardWithCategory
          v-for="post in posts"
          :key="post.slug"
          :href="post.href"
          :articleTitle="post.SITE_NAME"
          :articleDescription="post.brief"
          :articleImgURL="post.heroImage"
          :articleCategory="post.category"
          :articleDate="post.publishTime"
          class="item"
          @click.native="sendGaClickEvent('author’s article')"
        />
        <button
          v-if="enableLoadMore"
          class="g-button-load-more--arrow"
          @click="handleLoadMore"
        >
          <span>點我看更多</span>
        </button>
      </main>
      <aside class="g-aside">
        <ListArticleAside
          v-if="hasLatestPosts"
          :listTitle="'最新文章'"
          :listData="latestPosts"
          class="latest-list"
        />
        <FacebookPagePlugin />
      </aside>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { SITE_NAME } from '~/constants'
import { fetchContactBySlug } from '~/apollo/queries/contact.gql'
import {
  fetchPosts,
  fetchPostsAndCountByAuthorSlug,
} from '~/apollo/queries/posts.gql'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArticleCardWithCategory from '~/components/ArticleCardWithCategory'
import ContactBlock from '~/components/ContactBlock'
import FacebookPagePlugin from '~/components/FacebookPagePlugin.vue'
import ListArticleAside from '~/components/ListArticleAside'

const MAX_RESULTS = 10

export default {
  apollo: {
    contact: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.authorSlug,
        }
      },
      update(data) {
        return data.allContacts?.[0]
      },
    },
    posts: {
      query: fetchPostsAndCountByAuthorSlug,
      variables() {
        return {
          authorSlug: this.authorSlug,
          withCount: true,
        }
      },
      update(data) {
        this.postsCount = data._allPostsMeta.count
        return data.allPosts?.map?.(this.restructurePostFields)
      },
    },
  },
  components: {
    ArticleCardWithCategory,
    ContactBlock,
    FacebookPagePlugin,
    ListArticleAside,
  },
  data() {
    return {
      latestPosts: [],
      page: 1,
      postsCount: 0,
    }
  },
  head() {
    const title = `${this.authorName} - ${SITE_NAME}`
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
    authorSlug() {
      return this.$route.params.slug
    },
    authorName() {
      return this.contact?.name
    },
    contactImage() {
      return this.contact.image?.urlMobileSized
    },
    enableLoadMore() {
      return this.posts.length < this.postsCount
    },
    hasLatestPosts() {
      return this.latestPosts?.length > 0
    },
  },
  mounted() {
    this.fetchLatestPosts()
  },
  methods: {
    fetchLatestPosts() {
      this.$apollo.addSmartQuery('latestPosts', {
        query: fetchPosts,
        variables: {
          first: 5,
          withCoverPhoto: true,
        },
        update: (data) => {
          const items = data.allPosts || []
          return items.map(this.reducerArticleCard)
        },
      })
    },
    handleLoadMore() {
      this.$apollo.queries.posts.fetchMore({
        variables: {
          slug: this.authorSlug,
          skip: this.page * MAX_RESULTS,
          withCount: false,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.page += 1
          const combined = [
            ...previousResult.allPosts,
            ...fetchMoreResult.allPosts,
          ]
          return {
            allPosts: [...new Set(combined)],
            _allPostsMeta: {
              __typename: '_QueryMeta',
              count: this.postsCount,
            },
          }
        },
      })
      sendGaEvent(this.$ga)('author')('click')('more')
    },
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: post.heroImage?.urlMobileSized,
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
      }
    },
    restructurePostFields(item) {
      let brief = item.brief
      try {
        brief = JSON.parse(item.brief)?.html?.replace?.(/<[^>]*>?/gm, '')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      return {
        style: item.style,
        title: item.name,
        href: `/story/${item.slug}`,
        brief,
        publishTime: dayjs(item.publishTime).format('YYYY.MM.DD HH:mm'),
        heroImage: item.heroImage?.urlMobileSized,
        category: item.categories?.[0]?.name,
        test: JSON.parse(item.brief),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('author')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  @include media-breakpoint-up(xxl) {
    flex: 1;
    padding-right: 118px;
  }
  .item {
    margin: 20px 0 0;
    padding: 10px;
    border: 1px solid #d8d8d8;
    @include media-breakpoint-up(xxl) {
      padding: 20px;
    }
    ::v-deep {
      .article-card__img {
        width: 70px;
        height: 70px;
        @include media-breakpoint-up(xxl) {
          width: 100px;
          height: 100px;
        }
      }
      .article-title {
        color: #000;
      }
      .article-card__sub-info {
        display: flex;
        justify-content: space-between;
      }
      .article-card__brief {
        display: -webkit-box;
      }
    }
  }
}

.g-aside {
  @include media-breakpoint-up(xxl) {
    background-color: $color-grey;
  }
  .latest-list {
    @include media-breakpoint-up(md) {
      padding: 30px 80px;
      border: 1px solid #979797;
    }
    @include media-breakpoint-up(xxl) {
      padding: 0;
      border: none;
    }
    ::v-deep {
      .article-img {
        background-color: #fff;
      }
    }
  }
}

.g-button-load-more--arrow {
  margin: 30px auto 0;
  @include media-breakpoint-up(xxl) {
    max-width: 280px;
  }
}

.posts-count {
  margin: 30px 0 0;
  font-weight: 500;
  text-align: center;
  @include media-breakpoint-up(xxl) {
    margin-top: 45px;
  }
}
</style>
