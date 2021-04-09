<template>
  <section class="g-page">
    <div class="g-page__wrapper">
      <h1 class="tag__name" v-text="routeName" />
      <p v-if="!hasItems">目前沒有相關的文章</p>
      <ol v-else class="tag__list">
        <li v-for="post in posts" :key="post.slug" class="tag__list__item">
          <ArticleCard
            :href="post.href"
            :articleImgURL="post.image"
            :articleTitle="post.name"
            :articleDate="post.publishTime"
            mobileLayoutDirection="column"
            @click.native="sendGaClickEvent('article')"
          />
        </li>
        <div class="position-correct" />
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

<style lang="scss" scoped>
.g {
  &-page {
    @include media-breakpoint-up(sm) {
      padding-top: 0;
    }
    @include media-breakpoint-up(md) {
      padding-top: 48px;
    }
    &__wrapper {
      @include media-breakpoint-up(md) {
        max-width: 688px;
        display: block;
      }
      @include media-breakpoint-up(xl) {
        max-width: 1120px;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1200px;
      }
    }
  }
}
.tag {
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
