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
        <div v-if="liveVideoId" class="main__live-stream live-stream">
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
        </div>
        <div v-if="houseVideoId" class="main__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="請。鏡來"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-if="!isViewportWidthUpXl"
              :enableAutoplay="true"
              :videoId="houseVideoId"
            />
          </ClientOnly>
        </div>
        <div v-if="hasLivePlayListItems" class="main__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="直播現場"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-for="item in livePlayListIds"
              :key="item"
              :videoId="item"
              :enableAutoplay="true"
            />
          </ClientOnly>
        </div>
        <div
          v-if="shouldShowMainLatestPosts"
          class="main__list-latest-wrapper list-latest-wrapper"
        >
          <HeadingBordered text="即時新聞" class="home__heading" />
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
        <div v-if="shouldShowPopularList" class="aside-list main__popular-list">
          <HeadingBordered class="home__heading" text="熱門新聞" />
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
        <div v-if="shouldShowTopics" class="aside-list main__topic-list">
          <div class="topic-list__heading">
            <HeadingBordered class="home__heading" text="推薦專題" />
            <a href="/topic" target="_blank" rel="noreferrer noopener">
              更多專題
            </a>
          </div>
          <UiTopicIntroList :topics="topics" />
        </div>
      </main>
      <aside class="g-aside main__aside aside">
        <div v-if="liveVideoId" class="aside__live-stream live-stream">
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
        </div>
        <div v-if="houseVideoId" class="aside__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="請。鏡來"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-if="isViewportWidthUpXl"
              :enableAutoplay="true"
              :videoId="houseVideoId"
            />
          </ClientOnly>
        </div>
        <div v-if="hasLivePlayListItems" class="aside__live-stream live-stream">
          <HeadingBordered
            :showIcon="true"
            class="home__heading"
            text="直播現場"
          />
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-for="item in livePlayListIds"
              :key="item"
              :videoId="item"
              :enableAutoplay="true"
            />
          </ClientOnly>
        </div>

        <div v-if="hasPromotionVideos" class="aside-list promotion-list">
          <HeadingBordered class="home__heading" text="發燒單元" />
          <div class="promotion-list">
            <ClientOnly>
              <YoutubeEmbedByIframeApi
                v-for="item in promotionVideos"
                :key="item"
                :videoId="item"
                class="promotion-list__item"
              />
            </ClientOnly>
          </div>
        </div>

        <div
          v-if="shouldShowAsideLatestPosts"
          class="aside__list-latest-wrapper list-latest-wrapper"
        >
          <HeadingBordered text="即時新聞" class="home__heading" />
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
          v-if="shouldShowPopularList"
          class="aside-list aside__popular-list"
        >
          <HeadingBordered class="home__heading" text="熱門新聞" />
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

        <div v-if="shouldShowTopics" class="aside-list aside__topic-list">
          <div class="topic-list__heading">
            <HeadingBordered class="home__heading" text="推薦專題" />
            <a href="/topic" target="_blank" rel="noreferrer noopener">
              更多專題
            </a>
          </div>
          <UiTopicIntroList :topics="topics" />
        </div>

        <div v-if="hasShows" class="aside-list show-list">
          <HeadingBordered class="home__heading" text="節目" />
          <div class="show-list__wrapper">
            <ShowCard
              v-for="show in allShows"
              :key="show.slug"
              :slug="show.slug"
              :imageUrl="show.bannerImg"
              :isArtShow="show.isArtShow"
            />
          </div>
        </div>

        <div class="aside__link-list link-list">
          <div class="link-list__wrapper">
            <LinkAnchorStyle />
            <LinkYoutubeStyle />
            <FacebookPagePlugin href="https://www.facebook.com/mnewsTW/" />
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import { setIntersectionObserver } from '~/utils/intersection-observer'
import { handleYoutubeId } from '~/utils/content-handler'
import { getPostImageUrl } from '~/utils/image-handler'
import { FILTERED_SLUG } from '~/constants'
import { MICRO_AD_UNITS } from '~/constants/micro-ad'
import { fetchPosts } from '~/apollo/queries/post.gql'
import Swiper from '~/components/Swiper'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'
import UiFlashNews from '~/components/UiFlashNews'
import ShowCard from '~/components/ShowCard'
import UiTopicIntroList from '~/components/UiTopicIntroList'
import LinkAnchorStyle from '~/components/LinkAnchorStyle'

import { fetchEditorChoices } from '~/apollo/queries/editorChoices.gql'
import { fetchPromotionVideos } from '~/apollo/queries/promotionVideo.gql'
import { fetchShows } from '~/apollo/queries/show.gql'
import { fetchFeaturedTopics } from '~/apollo/queries/topic.gql'
import {
  fetchVideoByName,
  fetchVideoByCategorySlug,
} from '~/apollo/queries/video.gql'

const PAGE_SIZE = 12
const MICRO_AD_INDEXES = []
// const MICRO_AD_INDEXES = [3, 5, 9, 11]
const FIRST_PAGE_NUM = PAGE_SIZE - MICRO_AD_INDEXES.length

export default {
  apollo: {
    editorChoices: {
      query: fetchEditorChoices,
      update(data) {
        if (data) {
          const editorChoicesSlug = data.allEditorChoices?.map(
            (item) => item.choice.slug
          )
          this.filteredSlug = editorChoicesSlug.concat(FILTERED_SLUG)
        }
        return data.allEditorChoices
          ?.filter((item) => item.choice)
          ?.filter((item, i) => i < 5)
          ?.map((item) => this.reducerArticleCard(item.choice))
      },
    },
    allPublishedPosts: {
      query: fetchPosts,
      variables() {
        return {
          first: FIRST_PAGE_NUM,
          skip: 0,
          withCount: true,
          withCoverPhoto: true,
          filteredSlug: this.filteredSlug,
        }
      },
      update(data) {
        if (process.browser) {
          this.innerWidth = window.innerWidth
        }
        this.postsCount = data._allPostsMeta?.count - MICRO_AD_INDEXES.length
        return data.allPosts
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
      },
    },
    promotionVideos: {
      query: fetchPromotionVideos,
      update(data) {
        return data?.allPromotionVideos
          .filter((item) => item.ytUrl)
          .filter((item, i) => i < 5)
          .map((item) => handleYoutubeId(item.ytUrl))
      },
    },
    topics: {
      query: fetchFeaturedTopics,
      variables: {
        topic_first: 4,
        post_first: 3,
      },
      update: (data) => data?.allTopics,
    },
    allShows: {
      query: fetchShows,
      update(data) {
        return data.allShows
      },
    },
    liveVideo: {
      query: fetchVideoByName,
      variables() {
        return {
          name: 'mnews-live',
        }
      },
      update(data) {
        return data.allVideos?.[0]
      },
    },
    houseVideo: {
      query: fetchVideoByName,
      variables() {
        return {
          name: 'live-cam',
        }
      },
      update(data) {
        return data.allVideos?.[0]
      },
    },
    livePlayList: {
      query: fetchVideoByCategorySlug,
      variables() {
        return {
          slug: 'stream',
        }
      },
      update(data) {
        return data.allVideos ?? []
      },
    },
  },
  components: {
    Swiper,
    HeadingBordered,
    ArticleCard,
    ButtonLoadmore,
    FacebookPagePlugin,
    YoutubeEmbedByIframeApi,
    LinkYoutubeStyle,
    UiFlashNews,
    ShowCard,
    UiTopicIntroList,
    LinkAnchorStyle,
  },
  data() {
    return {
      allPublishedPosts: [],
      editorChoices: [],
      page: 0,
      livePlayList: [],
      postsCount: 0,
      allShows: [],
      promotionVideos: [],
      popularData: {},
      liveVideo: {},
      houseVideo: {},
      topics: [],
      filteredSlug: [],
      innerWidth: 0,
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchGcsData('/popularlist')
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
          content: `${getUrlOrigin(this.$config)}${this.$route.path}`,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    showEditorChoices() {
      return this.editorChoices?.length > 0
    },
    latestPosts() {
      const listData = this.allPublishedPosts?.map((post) =>
        this.reducerArticleCard(post)
      )
      return listData
      // return this.innerWidth ? this.insertMicroAds(listData) : listData
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
      const url = this.liveVideo?.youtubeUrl ?? ''
      return url ? handleYoutubeId(url) : ''
    },
    houseVideoId() {
      const url = this.houseVideo?.youtubeUrl ?? ''
      return url ? handleYoutubeId(url) : ''
    },
    livePlayListIds() {
      return this.livePlayList.map((item) => {
        const url = item?.youtubeUrl ?? ''
        return url ? handleYoutubeId(item.youtubeUrl) : ''
      })
    },
    flashNews() {
      const editorData = this.editorChoices.map((post) =>
        this.reducerEditorData(post)
      )
      const posts = this.allPublishedPosts
        .filter((post, i) => i < 8)
        .map((post) => this.reducerFlashNews(post))
      return editorData.concat(posts)
    },
    hasShows() {
      return this.allShows?.length
    },
    shouldShowMainLatestPosts() {
      return this.latestPosts?.length && this.innerWidth >= 1200
    },
    shouldShowAsideLatestPosts() {
      return this.latestPosts?.length && this.innerWidth < 1200
    },
    shouldShowPopularList() {
      return this.listPopularData?.length && this.innerWidth
    },
    hasLivePlayListItems() {
      return this.livePlayList?.length
    },
    hasPromotionVideos() {
      return this.promotionVideos?.length
    },
    shouldShowTopics() {
      return (
        this.topics?.length &&
        this.innerWidth &&
        this.$config.releaseTarget !== 'prod'
      )
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
        articleImgURL: getPostImageUrl(post),
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
    reducerEditorData(post) {
      return {
        slug: post.slug,
        name: post.articleTitle,
      }
    },
    reducerFlashNews(post) {
      return {
        slug: post.slug,
        name: post.name,
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('home')('click')(label)
    },
    insertMicroAds(listData) {
      const insertedListData = [...listData]
      const device = this.innerWidth < 768 ? 'MB' : 'PC'
      const unitList = MICRO_AD_UNITS.HOME_CATEGORY[device]
      const microAdList = MICRO_AD_INDEXES.map((item, i) => {
        const unit = unitList.find(
          (unit) => unit.name === `NA${i + 1}_${device}_HP`
        )
        return unit
          ? {
              insertIndex: item,
              unitId: unit.id,
            }
          : {
              insertIndex: item,
              unitId: '',
            }
      })
      microAdList.forEach((item, i) => {
        if (insertedListData[item.insertIndex - 1]) {
          insertedListData.splice(item.insertIndex, 0, {
            isMicroAd: true,
            microAdId: item.unitId,
            id: `micro-ad-${i}`,
          })
        }
      })
      return insertedListData
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPublishedPosts.fetchMore({
        variables: {
          first: PAGE_SIZE,
          skip: PAGE_SIZE * this.page,
          withCount: false,
          withCoverPhoto: true,
          filteredSlug: this.filteredSlug,
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
  padding-bottom: 8px;
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
      margin-bottom: 48px;
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
  margin: 40px 0 0;
  @include media-breakpoint-up(md) {
    margin-top: 48px;
  }
  &.main__popular-list {
    display: none;
    @include media-breakpoint-up(xl) {
      display: block;
      margin: 48px 0;
    }
  }
  &.aside__popular-list {
    display: block;
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
  .home__heading {
    min-width: 110px;
  }
  .promotion-list {
    width: 100%;
    margin-top: 12px;
    @include media-breakpoint-up(xl) {
      width: calc(100% + 2px); // 使影片寬於320px，以取得較大預覽圖
      transform: translateX(-1px);
    }
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
  &.main__topic-list {
    display: none;
    @include media-breakpoint-up(xl) {
      display: block;
      margin: 0 0 48px;
    }
    .topic-list__heading {
      margin: 0 0 32px;
      a {
        display: inline-block;
        font-size: 16px;
        line-height: 22px;
        color: $color-blue;
        margin: 0 0 4px 16px;
        border-bottom: 1px solid $color-blue;
      }
    }
  }
  &.aside__topic-list {
    display: block;
    @include media-breakpoint-up(xl) {
      display: none;
    }
    .topic-list__heading {
      margin: 0 0 28px;
      a {
        display: inline-block;
        font-size: 16px;
        line-height: 22px;
        color: $color-blue;
        margin: 0 0 4px 16px;
        border-bottom: 1px solid $color-blue;
      }
    }
  }
}

.link-list {
  margin: 0 0 8px;
  &__wrapper {
    @include media-breakpoint-up(md) {
      width: 336px;
    }
    @include media-breakpoint-up(xl) {
      width: 100%;
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
    margin: 32px auto 60px;
  }
}
</style>
