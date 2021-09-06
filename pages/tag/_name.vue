<template>
  <section class="g-page">
    <div class="g-page__wrapper">
      <h1 class="tag__name" v-text="routeName" />
      <p v-if="!hasItems">目前沒有相關的文章</p>
      <UiListHandler
        v-else
        :posts="posts"
        class="tag__list"
        @click-item="sendGaClickEvent('article')"
      />
      <ButtonLoadmore
        v-if="enableLoadMore"
        class="g-button-load-more"
        @click.native="handleLoadMore"
      />
    </div>
  </section>
</template>

<script>
import { SITE_NAME, FILTERED_SLUG } from '~/constants'

import { getUrlOrigin } from '~/utils/meta'
import { fetchPostsAndCountByTagName } from '~/apollo/queries/posts.gql'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import UiListHandler from '~/components/UiListHandler'
import ButtonLoadmore from '~/components/ButtonLoadmore'

const MAX_RESULTS = 12

export default {
  components: {
    UiListHandler,
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
          filteredSlug: FILTERED_SLUG,
        }
      },
      update(data) {
        this.postsCount = data._allPostsMeta?.count
        return data.allPosts?.map(this.restructurePost)
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
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
          filteredSlug: FILTERED_SLUG,
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

<style lang="scss" scoped>
.g-page__wrapper {
  @include media-breakpoint-up(md) {
    display: block;
  }
}
.tag {
  &__name {
    font-size: 18px;
    font-weight: 500;
    line-height: 25px;
    color: $color-blue;
    margin: 0 0 20px;
    @include media-breakpoint-up(md) {
      font-size: 20px;
      line-height: 32px;
      letter-spacing: 0.5px;
    }
  }
}
</style>
