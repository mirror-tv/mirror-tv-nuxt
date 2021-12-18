<template>
  <section class="g-page g-page--with-aside video">
    <div class="g-page__wrapper">
      <EditorChoicesVideoNews
        :items="videoEditorChoicesItems"
        class="editor-choices"
        @click="sendGaClickEvent('editors choice')"
      >
        <HeadingBordered text="編輯精選" />
      </EditorChoicesVideoNews>

      <main class="main">
        <div class="main__category-posts-wrapper category-posts-wrapper">
          <div v-if="hasPopularVideo" class="category-posts">
            <HeadingBordered class="category-posts__heading" text="熱門影音" />
            <ArticleListSlides
              :items="popularVideo"
              :total="popularVideo.length"
              class="category-posts__posts"
              @click-slide-item="sendGaClickEvent('articles')"
              @click-slide-next="
                sendGaClickEvent('right button for more articles')
              "
              @click-slide-prev="
                sendGaClickEvent('left button for more articles')
              "
            />
          </div>
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
        <UiLiveLists
          liveTitle="鏡電視LIVE"
          streamTitle="直播現場"
          :liveVideoId="liveVideoId"
          :livePlayListIds="livePlayListIds"
          class="aside__item"
        />
        <div class="aside__category-posts-wrapper category-posts-wrapper">
          <div v-if="hasPopularVideo" class="category-posts">
            <HeadingBordered class="category-posts__heading" text="熱門影音" />
            <ArticleListSlides
              :items="popularVideo"
              :total="popularVideo.length"
              class="category-posts__posts"
              @click-slide-item="sendGaClickEvent('articles')"
              @click-slide-next="
                sendGaClickEvent('right button for more articles')
              "
              @click-slide-prev="
                sendGaClickEvent('left button for more articles')
              "
            />
          </div>
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

        <UiPromotionList
          v-if="hasPromotionVideos"
          title="發燒單元"
          :promotionVideoIds="promotionVideoIds"
          class="aside__item"
        />
        <UiShowList
          v-if="hasShows"
          title="節目"
          :shows="allShows"
          class="aside__item"
        />
        <UiLinkList
          fbHref="https://www.facebook.com/mnewstw/"
          class="aside__item"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import { SITE_NAME, FILTERED_SLUG } from '~/constants'

import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleYoutubeId } from '~/utils/content-handler'
import ArticleListSlides from '~/components/ArticleListSlides'
import EditorChoicesVideoNews from '~/components/EditorChoicesVideoNews'
import HeadingBordered from '~/components/HeadingBordered'
import UiLiveLists from '~/components/UiLiveLists'
import UiPromotionList from '~/components/UiPromotionList'
import UiShowList from '~/components/UiShowList'
import UiLinkList from '~/components/UiLinkList'

import { fetchFeaturedCategories } from '~/apollo/queries/category.gql'
import { fetchVideoEditorChoices } from '~/apollo/queries/videoEditorChoices.gql'
import { fetchVideoPostsByCategorySlug } from '~/apollo/queries/post.gql'
import { fetchPromotionVideos } from '~/apollo/queries/promotionVideo.gql'
import { fetchShows } from '~/apollo/queries/show.gql'
import {
  fetchVideoByName,
  fetchVideoByCategorySlug,
} from '~/apollo/queries/video.gql'

const PAGE_SIZE = 12

export default {
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
      update: (data) =>
        data?.allCategories.filter(
          (category) => category.slug !== 'video' && category.slug !== 'ombuds'
        ),
    },
    videoEditorChoices: {
      query: fetchVideoEditorChoices,
      update: (data) => data.allVideoEditorChoices,
    },
    promotionVideos: {
      query: fetchPromotionVideos,
      update: (data) => data?.allPromotionVideos,
    },
    allShows: {
      query: fetchShows,
      update: (data) => data.allShows,
    },
    liveVideo: {
      query: fetchVideoByName,
      variables() {
        return {
          name: 'mnews-live',
        }
      },
      update: (data) => data.allVideos?.[0],
    },
    livePlayList: {
      query: fetchVideoByCategorySlug,
      variables() {
        return {
          slug: 'stream',
        }
      },
      update: (data) => data.allVideos,
    },
  },
  components: {
    ArticleListSlides,
    EditorChoicesVideoNews,
    HeadingBordered,
    UiLiveLists,
    UiPromotionList,
    UiShowList,
    UiLinkList,
  },
  data() {
    return {
      allCategories: [],
      livePlayList: [],
      promotionVideos: [],
      videoEditorChoices: [],

      // 避免取值時為 undefined -> dev
      politicPosts: {},
      // 避免取值時為 undefined -> staging
      newsPosts: {},
      entertainmentPosts: {},
      financePosts: {},
      internationalPosts: {},
      lifePosts: {},
      personPosts: {},
      politicsPosts: {},
      // 避免取值時為 undefined -> prod
      entPosts: {},
      uncPosts: {},
      lifPosts: {},
      socPosts: {},
      finPosts: {},
      intPosts: {},
      polPosts: {},
      perPosts: {},
      allShows: [],
      liveVideo: {},
      popularVideo: [],
      hasPlaylistItems: false,
    }
  },
  async fetch() {
    try {
      const videoRes = await this.$fetchGcsData('/popular-videonews-list')
      this.popularVideo = videoRes?.report
    } catch (error) {
      if (process.server) {
        // eslint-disable-next-line no-console
        console.error(error.message)
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
    categoriesFiltered() {
      return this.allCategories?.filter((category) => {
        return this[`${category.slug}Posts`]?.items?.length > 0
      })
    },
    categoriesSlug() {
      return this.allCategories?.map((category) => category.slug)
    },
    videoEditorChoicesItems() {
      return this.videoEditorChoices.map((item) => item.videoEditor) ?? []
    },
    liveVideoId() {
      const url = this.liveVideo?.youtubeUrl ?? ''
      return url ? handleYoutubeId(url) : ''
    },
    livePlayListIds() {
      return this.livePlayList.map((item) => {
        const url = item?.youtubeUrl ?? ''
        return url ? handleYoutubeId(item.youtubeUrl) : ''
      })
    },
    promotionVideoIds() {
      return (
        this.promotionVideos.map((item) => handleYoutubeId(item.ytUrl)) ?? []
      )
    },
    hasShows() {
      return this.allShows?.length
    },
    hasPopularVideo() {
      return this.popularVideo?.length
    },
    hasPromotionVideos() {
      return this.promotionVideoIds?.length
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
          query: fetchVideoPostsByCategorySlug,
          variables: () => ({
            first: PAGE_SIZE,
            category: slug,
            style: 'videoNews',
            withCount: true,
            filteredSlug: FILTERED_SLUG,
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
          first: PAGE_SIZE,
          skip: (page - 1) * PAGE_SIZE,
          withCount: false,
          filteredSlug: FILTERED_SLUG,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.$set(this[`${slug}Posts`], 'items', [
            ...previousResult.allPosts,
            ...fetchMoreResult.allPosts,
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
  padding-bottom: 8px;
  &.g-page--with-aside {
    .g-page__wrapper {
      @include media-breakpoint-up(md) {
        flex-wrap: wrap;
      }
      .main {
        margin-top: 32px;
        @include media-breakpoint-up(xl) {
          width: calc(100% - 384px - 64px);
          margin-top: 60px;
        }

        &__category-posts-wrapper {
          display: none;
          @include media-breakpoint-up(xl) {
            display: block;
          }
        }
      }

      .aside {
        &__category-posts-wrapper {
          display: block;
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
        margin-top: 48px;
      }
    }
    @include media-breakpoint-up(xl) {
      margin-top: 60px;
      padding-top: 8px;
      margin-left: 64px;
      border-left: 1px solid #d8d8d8;
      border-right: 1px solid #d8d8d8;
    }
  }
}

.category-posts {
  + .category-posts {
    margin-top: 24px;
    // tablet range
    @include media-breakpoint-up(md) {
      margin-top: 40px;
    }
    @include media-breakpoint-up(xl) {
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
    padding: 0 16px;
    margin-top: 20px;
    @include media-breakpoint-up(md) {
      padding: 0;
    }
  }
}
</style>
