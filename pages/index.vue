<template>
  <section class="g-page g-page--with-aside home">
    <div class="g-page__wrapper">
      <main class="main">
        <UiFlashNews class="main__flash-news" :articles="flashNews" />
        <div v-if="showEditorChoices" class="editor-choices-wrapper">
          <Swiper
            :slidesData="editorChoices"
            @click-slide="sendGaClickEvent('editor choices')"
          />
        </div>
        <div class="main__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="鏡電視LIVE"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-if="!isViewportWidthUpXl"
              :enableAutoplay="true"
              :videoId="liveVideoId"
            />
          </ClientOnly>
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="直播現場"
          />
          <YoutubeEmbed
            v-for="item in playlistItems"
            :key="item"
            :videoId="item"
          />
        </div>
        <div class="main__list-latest-wrapper list-latest-wrapper">
          <HeadingBordered text="最新新聞" class="home__heading" />
          <ol class="list-latest">
            <li v-for="post in latestPosts" :key="post.id">
              <ArticleCard
                :href="post.href"
                :labelTitle="post.labelTitle"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
                :articleStyle="post.articleStyle"
                @click.native="sendGaClickEvent('latest articles')"
              />
            </li>
          </ol>
          <ButtonLoadmore
            v-show="showLoadMoreButton"
            class="g-button-load-more button-load-more"
            @click.native="handleClickMore"
          />
        </div>
        <div
          v-if="listPopularData.length"
          class="aside-list main__popular-list"
        >
          <HeadingBordered class="home__heading" text="熱門文章" />
          <ol class="popular-list">
            <li
              v-for="item in listPopularData"
              :key="item.title"
              class="popular-list__item"
            >
              <a :href="item.href" target="_blank" rel="noreferrer noopener">
                {{ item.title }}
              </a>
            </li>
          </ol>
        </div>
      </main>
      <aside class="g-aside main__aside aside">
        <div class="aside__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="鏡電視LIVE"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-if="isViewportWidthUpXl"
              :enableAutoplay="true"
              :videoId="liveVideoId"
            />
          </ClientOnly>
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="直播現場"
          />
          <YoutubeEmbed
            v-for="item in playlistItems"
            :key="item"
            :videoId="item"
          />
        </div>

        <div class="aside-list promotion-list">
          <HeadingBordered class="home__heading" text="發燒單元" />
          <div class="promotion-list">
            <YoutubeEmbed
              v-for="item in promotionVideos"
              :key="item"
              :videoId="item"
              class="promotion-list__item"
            />
          </div>
        </div>

        <div class="aside__list-latest-wrapper list-latest-wrapper">
          <HeadingBordered text="最新新聞" class="home__heading" />
          <ol class="list-latest">
            <li v-for="post in latestPosts" :key="post.id">
              <ArticleCard
                :href="post.href"
                :labelTitle="post.labelTitle"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
                :articleStyle="post.articleStyle"
                @click.native="sendGaClickEvent('latest articles')"
              />
            </li>
          </ol>
          <ButtonLoadmore
            v-show="showLoadMoreButton"
            class="g-button-load-more button-load-more"
            @click.native="handleClickMore"
          />
        </div>

        <div
          v-if="listPopularData.length"
          class="aside-list aside__popular-list"
        >
          <HeadingBordered class="home__heading" text="熱門文章" />
          <ol class="popular-list">
            <li
              v-for="item in listPopularData"
              :key="item.title"
              class="popular-list__item"
            >
              <a :href="item.href" target="_blank" rel="noreferrer noopener">
                {{ item.title }}
              </a>
            </li>
          </ol>
        </div>

        <div class="aside-list show-list">
          <HeadingBordered class="home__heading" text="節目" />
          <div class="show-list__wrapper">
            <ShowCard v-for="show in allShows" :key="show.slug" :show="show" />
          </div>
        </div>

        <div class="aside__link-list link-list">
          <div class="link-list__wrapper">
            <LinkAnchorStyle />
            <LinkYoutubeStyle />
          </div>
          <FacebookPagePlugin />
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { getDomain } from '~/utils/meta'
import { fetchPosts, fetchPostsByCategories } from '~/apollo/queries/posts.gql'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import { setIntersectionObserver } from '~/utils/intersection-observer'
import Swiper from '~/components/Swiper'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import FacebookPagePlugin from '~/components/FacebookPagePlugin.vue'
import YoutubeEmbed from '~/components/YoutubeEmbed.vue'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi.vue'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'
import UiFlashNews from '~/components/UiFlashNews'
import ShowCard from '~/components/ShowCard'
import LinkAnchorStyle from '~/components/LinkAnchorStyle'

import { fetchEditorChoices } from '~/apollo/queries/editorChoices.gql'
import { fetchAllPromotionVideos } from '~/apollo/queries/promotionVideo.gql'
import { fetchAllShows } from '~/apollo/queries/show.gql'
import { fetchLiveVideoId } from '~/apollo/queries/video.gql'

import { getImageUrl } from '~/utils/post-image-handler'
const PAGE_SIZE = 12

export default {
  apollo: {
    editorChoices: {
      query: fetchEditorChoices,
      update(data) {
        return data.allEditorChoices
          ?.filter((item) => item.choice)
          ?.map((item) => this.reducerArticleCard(item.choice))
      },
    },
    allPublishedPosts: {
      query: fetchPosts,
      variables: {
        first: PAGE_SIZE,
        skip: 0,
        withCount: true,
        withCoverPhoto: true,
      },
      update(data) {
        this.postsCount = data._allPostsMeta?.count
        return data.allPosts
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
      },
    },
    flashNews: {
      query: fetchPostsByCategories,
      variables: {
        first: 8,
        categories: ['person', 'international'], // 暫時
      },
      update(data) {
        return data.allPosts
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
    liveVideo: {
      query: fetchLiveVideoId,
      update(data) {
        return data.allVideos[0]
      },
    },
  },
  components: {
    Swiper,
    HeadingBordered,
    ArticleCard,
    ButtonLoadmore,
    FacebookPagePlugin,
    YoutubeEmbed,
    YoutubeEmbedByIframeApi,
    LinkYoutubeStyle,
    UiFlashNews,
    ShowCard,
    LinkAnchorStyle,
  },
  data() {
    return {
      allPublishedPosts: [],
      editorChoices: [],
      flashNews: [],
      page: 0,
      playlistItems: [],
      postsCount: 0,
      allShows: [],
      promotionVideos: [],
      popularData: {},
      liveVideo: {},
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchPopularListData()
      const reponse = await this.$fetchYoutubeData(
        '/playlistItems?part=snippet&playlistId=PLT6yxVwBEbi2dWegLu37V63_tP-nI6em_&maxResults=3'
      )
      this.playlistItems =
        reponse?.items?.map((item) => item?.snippet?.resourceId?.videoId) ?? []
    } catch (error) {
      if (process.server) {
        // eslint-disable-next-line no-console
        console.error(error.message)
      }
    }
  },
  head() {
    return {
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getDomain()}${this.$route.path}`,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    editorChoicesSlug() {
      return this.editorChoices.map((item) => item.slug)
    },
    showEditorChoices() {
      return this.editorChoices?.length > 0
    },
    latestPosts() {
      const listData = this.allPublishedPosts ?? []
      return listData
        .filter((post) => !this.editorChoicesSlug.includes(post.slug))
        .map((post) => this.reducerArticleCard(post))
    },
    showLoadMoreButton() {
      return this.allPublishedPosts?.length < this.postsCount
    },
    listPopularData() {
      const listData = this.popularData?.report ?? []
      return listData
        .filter((report, i) => i < 10)
        .map((report) => this.reducerPopularList(report))
    },
    liveVideoId() {
      return this.liveVideo?.youtubeUrl?.split('watch?v=')[1] ?? ''
    },
  },
  mounted() {
    setIntersectionObserver({
      elements: [document.querySelector('.button-load-more')],
      handler: (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            sendGaEvent(this.$ga)('home')('scroll')('to more')
          }
        })
      },
    })
  },
  methods: {
    reducerArticleCard(post) {
      return {
        id: post.id,
        slug: post.slug,
        href: `/story/${post.slug}`,
        labelTitle: post.categories?.[0]?.name ?? ' ',
        articleImgURL: getImageUrl(post),
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
        articleStyle: post.style,
      }
    },
    reducerPopularList(report) {
      return {
        href: `/story/${report.slug}`,
        title: report.name,
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('home')('click')(label)
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPublishedPosts.fetchMore({
        variables: {
          first: PAGE_SIZE,
          skip: PAGE_SIZE * this.page,
          withCount: false,
          withCoverPhoto: true,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.allPosts
          return {
            allPosts: [...previousResult.allPosts, ...newPosts],
            _allPostsMeta: {
              __typename: '_QueryMeta',
              count: this.postsCount,
            },
          }
        },
      })
      this.sendGaClickEvent('more')
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  &__flash-news {
    width: calc(100% + 16px);
    transform: translateX(-8px);
    // tablet range
    @include media-breakpoint-up(md) {
      width: auto;
      transform: none;
    }
    + * {
      margin-top: 16px;
      // tablet range
      @include media-breakpoint-up(md) {
        margin-top: 30px;
      }
    }
  }
  &__live-stream {
    margin: 48px 0 0;
    @include media-breakpoint-up(md) {
      margin: 32px 0 0;
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
  &__list-latest-wrapper {
    display: none;
    // desktop range
    @include media-breakpoint-up(xl) {
      margin-top: 48px;
      display: block;
    }
  }
  &__aside {
    // desktop range
    @include media-breakpoint-up(xl) {
      margin-top: 0;
      background-color: $color-grey;
    }
    > * + .heading-bordered-wrapper {
      margin-top: 40px;
      @include media-breakpoint-up(md) {
        margin-top: 48px;
      }
    }
  }
  .editor-choices-wrapper {
    width: calc(100% + 32px);
    transform: translateX(-16px);
    &::v-deep {
      .article-img-wrapper {
        padding-top: 56.25%;
      }
      // desktop range
      @include media-breakpoint-up(xl) {
        .swiper-slide__slide {
          position: relative;
          width: 476px;
        }
        .swiper-button-nav {
          top: 50%;
          bottom: auto;
          transform: translateY(-100%);
        }
        .swiper-pagination {
          justify-content: flex-end;
          height: auto;
        }
        .article-img-wrapper {
          padding-top: 66.66%;
        }
        .info-wrapper {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: auto;
        }
      }
      // desktop UHD range
      @include media-breakpoint-up(xxl) {
        .swiper-slide__slide {
          width: 632px !important;
        }
        .swiper-pagination {
          width: 632px;
          margin: 0 auto;
          padding: 0;
        }
        .article-img-wrapper {
          padding-top: 56.25%;
        }
        .info-wrapper {
          padding: 20px 24px;
        }
      }
    }
    @include media-breakpoint-up(xl) {
      width: auto;
      transform: none;
      &__heading {
        display: inline-block;
      }
    }
  }
}

.home {
  > * + .main {
    margin-top: 16px;
  }
  &__heading {
    min-width: 110px;
    + * {
      margin-top: 16px;
    }
  }
}
.g-aside {
  > * {
    + * {
      margin-top: 0;
    }
  }
}

.aside {
  &__live-stream {
    display: none;
    // desktop range
    @include media-breakpoint-up(xl) {
      display: block;
    }
  }

  &__list-latest-wrapper {
    display: block;
    margin-top: 40px;
    @include media-breakpoint-up(md) {
      margin-top: 48px;
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
}

.live-stream {
  * + .home__heading {
    margin: 40px 0 0;
    @include media-breakpoint-up(md) {
      margin-top: 48px;
    }
  }
  .iframe-wrapper + .iframe-wrapper {
    margin-top: 16px;
  }
}

.aside-list {
  &.main__popular-list {
    display: none;
    @include media-breakpoint-up(xl) {
      display: block;
      .home__heading {
        margin-top: 60px;
      }
    }
  }
  &.aside__popular-list {
    display: block;
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
  .home__heading {
    margin: 40px 0 0;
    min-width: 110px;
    @include media-breakpoint-up(md) {
      margin-top: 48px;
    }
  }
  .promotion-list {
    margin-top: 12px;
    &__item {
      margin-bottom: 12px;
    }
  }
  .show-list__wrapper {
    padding-bottom: 12px;

    // tablet range
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 4px;
    }
  }
  .popular-list {
    &__item {
      position: relative;
      padding: 16px 0 16px 28px;
      border-bottom: 1px solid #f4f5f7;
      ::before {
        content: '';
        position: absolute;
        top: 24px;
        left: 8px;
        border: 4px solid #f4f5f6;
        border-radius: 50%;
      }
      @include media-breakpoint-up(md) {
        padding: 12px 0 12px 28px;
        ::before {
          top: 20px;
        }
      }
      a {
        font-size: 16px;
        line-height: 22px;
        &:hover {
          border-bottom: 1px solid #000;
        }
      }
    }
  }
}

.link-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  // tablet range
  @include media-breakpoint-up(md) {
    flex-direction: row;
  }

  // desktop  range
  @include media-breakpoint-up(xl) {
    flex-direction: column;
  }

  &__wrapper {
    flex: 1;
    // tablet range
    @include media-breakpoint-up(md) {
      margin-right: 16px;
    }

    // desktop  range
    @include media-breakpoint-up(xl) {
      margin-right: 0;
    }
  }
}

.list-latest {
  margin: 16px 0 0;
  li + li {
    margin-top: 16px;
  }
  // tablet range
  @include media-breakpoint-up(md) {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 30px);
    transform: translateX(-15px);
    margin: 0;
    li {
      width: calc((100% - 90px) / 3);
      margin: 16px 15px 0;
    }
    &::v-deep {
      .article-card {
        width: auto;
      }
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
  // desktop  range
  @include media-breakpoint-up(xl) {
    width: calc(100% + 24px);
    transform: translateX(-12px);
    li {
      width: calc((100% - 72px) / 3);
      margin: 16px 12px 0;
    }
  }
}

.g-button-load-more {
  margin: 24px auto 0;
  @include media-breakpoint-up(lg) {
    margin: 32px auto 0;
  }
}
</style>
