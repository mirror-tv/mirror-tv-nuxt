<template>
  <section class="g-page">
    <div class="g-page__wrapper">
      <h1 class="g-list-heading" v-text="routeName" />
      <p v-if="!hasItems">目前沒有相關的文章</p>
      <ol v-else class="g-list">
        <li v-for="post in posts" :key="post.slug" class="g-list__item">
          <ArticleCard
            :href="post.href"
            :articleImgURL="post.image"
            :articleTitle="post.name"
            :articleDate="post.publishTime"
            mobileLayoutDirection="column"
            @click.native="sendGaClickEvent('article')"
          />
        </li>
      </ol>
      <ButtonLoadmore
        v-if="enableLoadMore"
        class="g-button-load-more"
        @click.native="handleLoadMore"
      />
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'

import { getDomain } from '~/utils/meta'
import { fetchPostsAndCountByTagName } from '~/apollo/queries/posts.gql'
import { sendGaEvent } from '~/utils/google-analytics'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'

const MAX_RESULTS = 12

export default {
  components: {
    ArticleCard,
    ButtonLoadmore,
  },
  apollo: {
    posts: {
      query: fetchPostsAndCountByTagName,
      variables() {
        return {
          tagName: this.routeName,
          maxResults: MAX_RESULTS,
          withCount: true,
        }
      },
      update(data) {
        this.postsCount = data._allPostsMeta?.count
        return data.allPosts?.map(this.restructurePost)
      },
      error() {
        this.$nuxt.error({ statusCode: 500 })
      },
    },
  },
  data() {
    return {
      page: 1,
      postsCount: 0,
    }
  },
  head() {
    const title = `${this.routeName} - ${SITE_NAME}`
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
    enableLoadMore() {
      return this.posts.length < this.postsCount
    },
    hasItems() {
      return this.posts?.length > 0
    },
    routeName() {
      return this.$route.params.name
    },
  },
  methods: {
    handleLoadMore() {
      this.$apollo.queries.posts.fetchMore({
        variables: {
          tagName: this.routeName,
          maxResults: MAX_RESULTS,
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
      this.sendGaClickEvent('more')
    },
    restructurePost(post) {
      return {
        href: `/story/${post.slug}`,
        slug: post.slug,
        name: post.name,
        image: post.heroImage?.urlMobileSized,
        publishTime: new Date(post.publishTime),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('tag')('click')(label)
    },
  },
}
</script>
