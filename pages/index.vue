<template>
  <section class="g-page g-page--with-aside home">
    <div v-if="innerWidth" class="g-page__wrapper">
      <main class="main">
        <UiFlashNews :articles="flashNews" class="flash-news-wrapper" />
        <div v-if="showEditorChoices" class="editor-choices-wrapper">
          <Swiper
            :slidesData="formatedEditorChoices"
            @click-slide="sendGaClickEvent('editor choices')"
          />
        </div>
        <UiLiveLists
          v-if="!isViewportWidthUpXl"
          liveTitle="鏡電視LIVE"
          houseTitle="請。鏡來"
          streamTitle="直播現場"
          :liveVideoId="liveVideoId"
          :houseVideoId="houseVideoId"
          :livePlayListIds="livePlayListIds"
        />
        <div v-if="shouldShowLatestPosts" class="list-latest-wrapper">
          <HeadingBordered text="即時新聞" class="heading" />
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
            @button-mounted="setObserver"
          />
        </div>
        <UiPopularList
          v-if="shouldShowPopularList"
          title="熱門新聞"
          :listPopularData="listPopularData"
          class="popular-list-wrapper"
        />
        <UiTopicList
          v-if="shouldShowTopics"
          title="推薦專題"
          :topics="topics"
          class="topic-list-wrapper"
        />
      </main>
      <aside class="g-aside aside">
        <UiLiveLists
          v-if="isViewportWidthUpXl"
          liveTitle="鏡電視LIVE"
          houseTitle="請。鏡來"
          streamTitle="直播現場"
          :liveVideoId="liveVideoId"
          :houseVideoId="houseVideoId"
          :livePlayListIds="livePlayListIds"
          class="aside__item"
        />
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
          fbHref="https://www.facebook.com/mnewsTW/"
          class="aside__item"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { FILTERED_SLUG } from '~/constants'
import { MICRO_AD_UNITS } from '~/constants/micro-ad'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import { setIntersectionObserver } from '~/utils/intersection-observer'
import { handleYoutubeId } from '~/utils/content-handler'
import { getPostImageUrl } from '~/utils/image-handler'
import Swiper from '~/components/Swiper'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore'
import UiLiveLists from '~/components/UiLiveLists'
import UiPromotionList from '~/components/UiPromotionList'
import UiShowList from '~/components/UiShowList'
import UiLinkList from '~/components/UiLinkList'
import UiPopularList from '~/components/UiPopularList'
import UiFlashNews from '~/components/UiFlashNews'
import UiTopicList from '~/components/UiTopicList'

import { fetchPosts } from '~/apollo/queries/post.gql'
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
        if (process.browser) {
          this.innerWidth = window.innerWidth
        }
        const editorChoicesSlug = data.allEditorChoices?.map(
          (item) => item.choice.slug
        )
        this.filteredSlug = editorChoicesSlug.concat(FILTERED_SLUG)
        return data.allEditorChoices
      },
    },
    allPublishedPosts: {
      query: fetchPosts,
      variables() {
        return {
          first: FIRST_PAGE_NUM,
          skip: 0,
          withCount: true,
          filteredSlug: this.filteredSlug,
        }
      },
      update(data) {
        this.postsCount = data._allPostsMeta?.count - MICRO_AD_INDEXES.length
        return data.allPosts
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
      },
    },
    promotionVideos: {
      query: fetchPromotionVideos,
      update: (data) => data?.allPromotionVideos,
    },
    topics: {
      query: fetchFeaturedTopics,
      variables: {
        topicFirst: 4,
        postFirst: 3,
      },
      update: (data) => data?.allTopics,
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
    houseVideo: {
      query: fetchVideoByName,
      variables() {
        return {
          name: 'live-cam',
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
    Swiper,
    HeadingBordered,
    ArticleCard,
    ButtonLoadmore,
    UiLiveLists,
    UiPromotionList,
    UiShowList,
    UiLinkList,
    UiFlashNews,
    UiPopularList,
    UiTopicList,
  },
  data() {
    return {
      page: 0,
      postsCount: 0,
      innerWidth: 0,
      allPublishedPosts: [],
      editorChoices: [],
      livePlayList: [],
      allShows: [],
      promotionVideos: [],
      topics: [],
      filteredSlug: [],
      popularData: {},
      liveVideo: {},
      houseVideo: {},
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
    formatedEditorChoices() {
      return (
        this.editorChoices?.map((item) =>
          this.reducerArticleCard(item.choice)
        ) ?? []
      )
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
      const editorData = this.formatedEditorChoices.map((post) =>
        this.reducerEditorData(post)
      )
      const posts = this.allPublishedPosts
        .filter((post, i) => i < 8)
        .map((post) => this.reducerFlashNews(post))
      return editorData.concat(posts)
    },
    promotionVideoIds() {
      return (
        this.promotionVideos.map((item) => handleYoutubeId(item.ytUrl)) ?? []
      )
    },
    hasShows() {
      return this.allShows?.length
    },
    shouldShowLatestPosts() {
      return this.latestPosts?.length && this.innerWidth
    },
    shouldShowPopularList() {
      return this.listPopularData?.length && this.innerWidth
    },
    hasPromotionVideos() {
      return this.promotionVideoIds?.length
    },
    shouldShowTopics() {
      return (
        this.topics?.length &&
        this.innerWidth &&
        this.$config.releaseTarget !== 'prod'
      )
    },
  },
  // mounted() {
  //   setIntersectionObserver({
  //     elements: [document.querySelector('.button-load-more')],
  //     handler: (entries, observer) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           observer.disconnect()
  //           sendGaEvent(this.$ga)('home')('scroll')('to more')
  //         }
  //       })
  //     },
  //   })
  // },
  methods: {
    reducerArticleCard(post) {
      return {
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
    setObserver() {
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
  .flash-news-wrapper {
    width: calc(100% + 16px);
    transform: translateX(-8px);
    margin: 0 0 16px;
    @include media-breakpoint-up(md) {
      width: auto;
      transform: none;
      margin: 0 0 24px;
    }
  }
  .editor-choices-wrapper {
    width: calc(100% + 32px);
    transform: translateX(-16px);
    margin: 0 0 48px;
    &::v-deep {
      .article-img-wrapper {
        padding-top: 56.25%;
      }
      @include media-breakpoint-up(md) {
        .swiper-slide__slide {
          position: relative;
          width: 524px;
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
          padding: 20px 24px;
        }
      }
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
  .list-latest-wrapper {
    margin: 0 0 48px;
    @include media-breakpoint-up(md) {
      margin: 0 0 60px;
    }
    .list-latest {
      margin: 16px 0 0;
      li + li {
        margin-top: 16px;
      }
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
      @include media-breakpoint-up(xl) {
        width: calc(100% + 24px);
        transform: translateX(-12px);
        li {
          width: calc((100% - 72px) / 3);
          margin: 16px 12px 0;
        }
      }
    }
  }
  .popular-list-wrapper {
    margin: 0 0 40px;
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
  }
  .topic-list-wrapper {
    margin: 0 0 40px;
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
  }
}

.g-button-load-more {
  margin: 24px auto 0;
  @include media-breakpoint-up(lg) {
    margin: 32px auto 60px;
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
  @include media-breakpoint-up(xl) {
    background-color: $color-grey;
  }
  &__item {
    margin: 0 0 40px;
    @include media-breakpoint-up(md) {
      margin: 0 0 48px;
    }
  }
}
</style>
