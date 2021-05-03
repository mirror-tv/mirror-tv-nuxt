<template>
  <section class="g-page g-page--with-aside video">
    <div class="g-page__wrapper">
      <EditorChoicesVideoNews
        :items="videoEditorChoices"
        class="editor-choices"
        @click="sendGaClickEvent('editors choice')"
      >
        <HeadingBordered text="編輯精選" />
      </EditorChoicesVideoNews>

      <main class="main">
        <div class="main__category-posts-wrapper category-posts-wrapper">
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
        <div class="aside__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            text="鏡電視LIVE"
            class="video__heading"
          />
          <YoutubeEmbedByIframeApi
            :enableAutoplay="true"
            videoId="coYw-eVU0Ks"
          />
          <HeadingBordered
            :showIcon="true"
            text="直播現場"
            class="video__heading"
          />
          <YoutubeEmbed
            v-for="item in playlistItems"
            :key="item"
            :videoId="item"
          />
        </div>

        <div class="aside__category-posts-wrapper category-posts-wrapper">
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

        <div class="aside__show-list show-list">
          <HeadingBordered class="home__heading" text="發燒單元" />
          <div class="promotion-list">
            <YoutubeEmbed
              v-for="item in promotionVideos"
              :key="item"
              :videoId="item"
            />
          </div>
        </div>

        <div class="aside__show-list show-list">
          <HeadingBordered class="home__heading" text="節目" />
          <div class="show-list__wrapper">
            <ShowCard v-for="show in allShows" :key="show.slug" :show="show" />
          </div>
        </div>

        <div class="aside__link-list link-list">
          <div class="link-list__wrapper">
            <LinkAnchorStyle />
            <LinkYoutubeStyle />
            <FacebookPagePlugin />
          </div>
        </div>
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
import YoutubeEmbed from '~/components/YoutubeEmbed.vue'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi.vue'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'
import ShowCard from '~/components/ShowCard'
import LinkAnchorStyle from '~/components/LinkAnchorStyle'

import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import { fetchVideoEditorChoices } from '~/apollo/queries/videoEditorChoices.gql'
import { fetchPostsByCategorySlug } from '~/apollo/queries/posts.gql'
import { fetchAllPromotionVideos } from '~/apollo/queries/promotionVideo.gql'
import { fetchAllShows } from '~/apollo/queries/show.gql'

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
    promotionVideos: {
      query: fetchAllPromotionVideos,
      update(data) {
        return data?.allPromotionVideos
          .filter((item, i) => i < 5)
          .map((item) => item.ytUrl?.split('watch?v=')[1])
      },
    },
    allShows: {
      query: fetchAllShows,
      update(data) {
        return data.allShows
      },
    },
  },
  components: {
    ArticleListSlides,
    EditorChoicesVideoNews,
    HeadingBordered,
    FacebookPagePlugin,
    YoutubeEmbed,
    YoutubeEmbedByIframeApi,
    LinkYoutubeStyle,
    ShowCard,
    LinkAnchorStyle,
  },
  data() {
    return {
      allCategories: [],
      playlistItems: [],
      promotionVideos: [],
      videoEditorChoices: [],

      // 避免取值時為 undefined
      newsPosts: {},
      entertainmentPosts: {},
      financePosts: {},
      internationalPosts: {},
      lifePosts: {},
      personPosts: {},
      politicsPosts: {},
      allShows: [],
    }
  },
  async fetch() {
    try {
      const reponse = await this.$fetchYoutubeData(
        '/playlistItems?part=snippet&playlistId=PLT6yxVwBEbi2dWegLu37V63_tP-nI6em_&maxResults=3'
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
.video {
  &.g-page--with-aside {
    .g-page__wrapper {
      @include media-breakpoint-up(md) {
        flex-wrap: wrap;
      }
      .main {
        margin-top: 32px;

        // desktop  range
        @include media-breakpoint-up(xl) {
          width: calc(100% - 384px - 64px);
          margin-top: 60px;
        }

        &__category-posts-wrapper {
          display: none;
          // desktop range
          @include media-breakpoint-up(xl) {
            display: block;
          }
        }
      }

      .aside {
        &__category-posts-wrapper {
          display: block;
          // desktop range
          @include media-breakpoint-up(xl) {
            display: none;
          }
        }
      }
    }
  }
  .g-aside {
    margin-top: 48px;

    > * {
      + * {
        margin-top: 32px;
      }
    }
    // desktop  range
    @include media-breakpoint-up(xl) {
      margin-top: 60px;
      padding-top: 8px;
      margin-left: 64px;
      border-left: 1px solid #d8d8d8;
      border-right: 1px solid #d8d8d8;
    }

    // .heading-bordered-wrapper {
    //   margin-top: 48px;

    //   &:first-child {
    //     margin-top: 0;
    //   }
    // }
  }
}

.editor-choices {
  @include media-breakpoint-up(md) {
    margin: 22px 0 0;
  }
}

.live-stream {
  * + .video__heading {
    margin: 40px 0 0;
  }
  .iframe-wrapper {
    margin-top: 16px;
  }
}

.category-posts {
  + .category-posts {
    margin-top: 24px;
    // tablet range
    @include media-breakpoint-up(md) {
      margin-top: 48px;
    }
  }
  &-wrapper {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    @include media-breakpoint-up(md) {
      left: auto;
      width: auto;
    }
  }
  &__heading {
    width: 110px;
    margin-left: 20px;
    @include media-breakpoint-up(md) {
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
    @include media-breakpoint-up(md) {
      padding: 0;
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

.show-list {
  .home__heading {
    min-width: 110px;
    // desktop range
    @include media-breakpoint-up(xl) {
      margin: 30px 0 0;
    }
  }
  .promotion-list {
    margin-top: 12px;
  }
  &__wrapper {
    margin-top: 12px;
    padding-bottom: 12px;

    // tablet range
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 4px;
    }
  }
}

.link-list {
  display: flex;
  justify-content: flex-end;
  &__wrapper {
    width: 100%;
    // tablet range
    @include media-breakpoint-up(md) {
      width: 50%;
    }

    // desktop  range
    @include media-breakpoint-up(xl) {
      width: 100%;
    }
  }
}
</style>
