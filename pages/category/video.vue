<template>
  <section class="g-page g-page--with-aside">
    <div class="g-page__wrapper">
      <EditorChoicesVideoNews
        :items="videoEditorChoices"
        class="editor-choices"
        @click="sendGaClickEvent('editors choice')"
      >
        <HeadingBordered text="編輯精選" />
      </EditorChoicesVideoNews>
      <main class="main">
        <div class="category-posts-wrapper">
          <div
            v-for="category in categoriesFiltered"
            :key="category.slug"
            class="category-posts"
          >
            <a
              :href="`/category/${category.slug}`"
              target="_blank"
              rel="noopener noreferrer"
              @click="sendGaClickEvent('categories page')"
            >
              <HeadingBordered
                class="category-posts__heading"
                :text="category.name"
              />
              <span class="category-posts__link" />
            </a>
            <ArticleListSlides
              :items="getPostsByCategory(category.slug).items"
              :total="getPostsByCategory(category.slug).total"
              class="category-posts__posts"
              @click-slide-item="sendGaClickEvent('articles')"
              @click-slide-next="
                sendGaClickEvent('right button for more articles')
              "
              @click-slide-prev="
                sendGaClickEvent('left button for more articles')
              "
              @load-more="handleLoadMorePostsByCategory(category.slug, $event)"
            />
          </div>
        </div>
      </main>
      <aside class="g-aside">
        <HeadingBordered text="LIVE" />
        <IframeYoutube :enableAutoplay="true" videoId="4ZVUmEUFwaY" />
        <HeadingBordered text="直播" />
        <IframeEmbedYoutube
          v-for="item in playlistItems"
          :key="item"
          :videoId="item"
        />
        <FacebookPagePlugin />
        <LinkYoutubeStyle />
      </aside>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'

import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArticleListSlides from '~/components/ArticleListSlides'
import EditorChoicesVideoNews from '~/components/EditorChoicesVideoNews'
import HeadingBordered from '~/components/HeadingBordered'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import IframeEmbedYoutube from '~/components/IframeEmbedYoutube.vue'
import IframeYoutube from '~/components/IframeYoutube.vue'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'

import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import { fetchVideoEditorChoices } from '~/apollo/queries/videoEditorChoices.gql'
import { fetchPostsByCategorySlug } from '~/apollo/queries/posts.gql'

export default {
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
      update: (data) =>
        data?.allCategories.filter((category) => category.slug !== 'video'),
    },
    videoEditorChoices: {
      query: fetchVideoEditorChoices,
      update: (data) => {
        return data.allVideoEditorChoices
          .filter((item) => item.videoEditor)
          .map((item) => item.videoEditor)
      },
    },
  },
  components: {
    ArticleListSlides,
    EditorChoicesVideoNews,
    HeadingBordered,
    FacebookPagePlugin,
    IframeEmbedYoutube,
    IframeYoutube,
    LinkYoutubeStyle,
  },
  data() {
    return {
      allCategories: [],
      playlistItems: [],
      videoEditorChoices: [],

      // 避免取值時為 undefined
      newsPosts: {},
      entertainmentPosts: {},
      financePosts: {},
      internationalPosts: {},
      lifePosts: {},
      personPosts: {},
      politicsPosts: {},
    }
  },
  async fetch() {
    try {
      const reponse = await this.$fetchYoutubeData(
        '/playlistItems?part=snippet&playlistId=PLIufxCyJpxOx4fCTTNcC7XCVZgY8MYQT5&maxResults=3'
      )
      this.playlistItems =
        reponse?.items?.map((item) => item?.snippet?.resourceId?.videoId) ?? []
    } catch (error) {
      if (process.server) {
        // eslint-disable-next-line no-console
        console.error('[ERROR]Youtube API:', error.message)
      }
    }
  },
  head() {
    const title = `影音 - ${SITE_NAME}`
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
    categoriesFiltered() {
      return this.allCategories?.filter((category) => {
        return this[`${category.slug}Posts`]?.items?.length > 0
      })
    },
    categoriesSlug() {
      return this.allCategories?.map((category) => category.slug)
    },
  },
  mounted() {
    if (this.categoriesSlug?.length > 0) {
      this.fetchPostsByCategory()
    }
  },
  methods: {
    fetchPostsByCategory() {
      this.categoriesSlug.forEach((slug) => {
        this.$apollo.addSmartQuery(`${slug}Posts`, {
          query: fetchPostsByCategorySlug,
          variables: () => ({
            category: slug,
            style: 'videoNews',
            withCount: true,
          }),
          update: (rawData) => {
            const data = {
              items: rawData.allPosts || [],
              total: rawData._allPostsMeta?.count ?? 0,
            }
            this[`${slug}Posts`] = data
            return data
          },
        })
      })
    },
    getPostsByCategory(slug) {
      const data = this[`${slug}Posts`]
      return { items: data?.items ?? [], total: data?.total ?? 0 }
    },
    handleLoadMorePostsByCategory(slug, page) {
      this.$apollo.queries?.[`${slug}Posts`]?.fetchMore({
        variables: {
          category: slug,
          skip: page * 10,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.$set(this[`${slug}Posts`], 'items', [
            ...previousResult.posts,
            ...fetchMoreResult.posts,
          ])
        },
      })
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('videonews')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page--with-aside {
  .g-page__wrapper {
    @include media-breakpoint-up(xxl) {
      flex-wrap: wrap;
    }
  }
}

.g-aside {
  @include media-breakpoint-up(xxl) {
    border-left: 1px solid #d8d8d8;
  }
}

.editor-choices {
  @include media-breakpoint-up(xl) {
    margin: 22px 0 0;
  }
}

.category-posts {
  + .category-posts {
    margin-top: 40px;
    @include media-breakpoint-up(xl) {
      margin-top: 50px;
    }
  }
  &-wrapper {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    @include media-breakpoint-up(xl) {
      left: auto;
      width: auto;
    }
  }
  &__heading {
    width: 110px;
    margin-left: 20px;
    @include media-breakpoint-up(xl) {
      margin-left: 4px;
    }
  }
  &__link {
    display: inline;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid $color-blue;
      border-color: $color-blue $color-blue transparent transparent;
      transform: rotate(45deg);
    }
  }
  &__posts {
    padding: 0 20px;
    margin-top: 20px;
    @include media-breakpoint-up(xl) {
      padding: 0 4px;
    }
  }
}

.live-iframe {
  position: relative;
  padding-top: 56.25%;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
