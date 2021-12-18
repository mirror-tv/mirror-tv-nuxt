<template>
  <div class="g-page topic-listing">
    <div class="topic-listing__content">
      <h2>推薦專題</h2>
      <ul>
        <li v-for="topic in topics.items" :key="topic.id">
          <UiTopicListingCard
            :href="topic.href"
            :title="topic.title"
            :brief="topic.brief"
            :image="topic.image.src"
          />
        </li>
        <div class="position-correct" />
      </ul>
      <ClientOnly v-if="shouldMountInfiniteLoading">
        <InfiniteLoading @infinite="loadMoreItems">
          <div slot="spinner" />
          <div slot="no-more" />
          <div slot="no-results" />
          <div slot="error" />
        </InfiniteLoading>
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { handleApiData } from '~/utils/content-handler'
import UiTopicListingCard from '~/components/UiTopicListingCard'
import { fetchTopics } from '~/apollo/queries/topic.gql'

const PAGE_SIZE = 12

export default {
  components: {
    InfiniteLoading,
    UiTopicListingCard,
  },
  apollo: {
    topics: {
      query: fetchTopics,
      variables() {
        return {
          first: PAGE_SIZE,
          withCount: true,
        }
      },
      update(data) {
        const { items, meta } = data

        return {
          ...this.topics,
          items: this.transformTopicItems(items),
          meta,
        }
      },
    },
  },
  data() {
    return {
      topics: {
        items: [],
        meta: {
          count: 0,
        },
        isLoading: false,
      },
    }
  },
  head() {
    const title = `專題 - ${SITE_NAME}`
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
    shouldMountInfiniteLoading() {
      return this.totalItems > 0
    },
    doesHaveAnyItemsLeftToLoad() {
      return this.totalItems < this.topics?.meta?.count
    },
    totalItems() {
      return this.topics?.items?.length
    },
  },
  methods: {
    transformTopicItems(items) {
      return items.map((item) => {
        const {
          id = '',
          slug = '',
          title = '',
          briefApiData = '',
          heroImage = {},
        } = item || {}

        return {
          id,
          title,
          href: `/topic/${slug}`,
          brief: this.transformBrief(briefApiData),
          image: {
            src:
              heroImage?.urlMobileSized ||
              heroImage?.urlTabletSized ||
              require('~/assets/img/default/image-default.jpg'),
          },
        }
      })
    },
    transformBrief(briefApiData = '') {
      const data = briefApiData ? handleApiData(briefApiData) : []
      return data.length && this.doesHaveBrief(data) ? data : []
    },
    doesHaveBrief(data = []) {
      const validateArray = data.map((item) => {
        return item?.content?.length > 1 || item?.content[0]?.length > 0
      })
      return validateArray.find((item) => {
        return item
      })
    },
    async loadMoreItems(state) {
      if (this.topics.isLoading) return
      this.topics.isLoading = true
      try {
        await this.$apollo.queries.topics.fetchMore({
          variables: {
            skip: this.totalItems,
            first: this.PAGE_SIZE,
            withCount: false,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              items: [...previousResult.items, ...fetchMoreResult.items],
              meta: this.topics.meta,
            }
          },
        })
        if (this.doesHaveAnyItemsLeftToLoad) {
          state.loaded()
        } else {
          state.complete()
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        state.error()
      } finally {
        this.topics.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.topic-listing {
  &__content {
    width: 100%;
    margin: 0 auto 48px;
    @include media-breakpoint-up(md) {
      max-width: 688px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 1120px;
    }
    @include media-breakpoint-up(xxl) {
      max-width: 1200px;
    }
    h2 {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.6;
      letter-spacing: 0.5px;
      color: $color-blue;
      margin: 0 0 40px;
    }
    ul {
      width: 100%;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      &::after {
        content: '';
      }
      li,
      .position-correct,
      &::after {
        width: 100%;
        @include media-breakpoint-up(md) {
          width: calc((100% - 16px) / 3);
        }
        @include media-breakpoint-up(xl) {
          width: calc((100% - 96px) / 3);
        }
      }
      li {
        margin: 0 0 28px;
        @include media-breakpoint-up(xl) {
          margin: 0 0 48px;
        }
      }
    }
  }
}
</style>
