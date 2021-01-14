<template>
  <section class="g-page-with-aside home">
    <div class="g-page-with-aside__wrapper">
      <main class="main">
        <UiFlashNews class="main__flash-news" :articles="flashNews" />
        <div v-if="showEditorChoices" class="editor-choices-wrapper">
          <HeadingBordered
            class="editor-choices-wrapper__heading home__heading"
            :text="'編輯精選'"
          />
          <Swiper
            :slidesData="editorChoices"
            @click-slide="sendGaClickEvent('editor choices')"
          />
        </div>
        <div class="main__live-stream live-stream">
          <HeadingBordered class="home__heading" text="LIVE" />
          <IframeYoutube :enableAutoplay="true" videoId="4ZVUmEUFwaY" />
          <HeadingBordered class="home__heading" text="直播" />
          <IframeEmbedYoutube
            v-for="item in playlistItems"
            :key="item"
            :videoId="item"
          />
        </div>
        <div class="main__list-latest-wrapper list-latest-wrapper">
          <HeadingBordered :text="'最新文章'" class="home__heading" />
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
            class="list-latest-wrapper__button-load-more button-load-more"
            @click.native="handleClickMore"
          />
        </div>
      </main>
      <aside class="g-aside main__aside aside">
        <div class="aside__live-stream live-stream">
          <HeadingBordered class="home__heading" text="LIVE" />
          <IframeYoutube :enableAutoplay="true" videoId="4ZVUmEUFwaY" />
          <HeadingBordered class="home__heading" text="直播" />
          <IframeEmbedYoutube
            v-for="item in playlistItems"
            :key="item"
            :videoId="item"
          />
        </div>
        <FacebookPagePlugin />
        <LinkYoutubeStyle />
      </aside>
    </div>
  </section>
</template>

<script>
import { getDomain } from '~/utils/meta'
import { fetchPosts, fetchPostsByCategories } from '~/apollo/queries/posts.gql'
import { sendGaEvent } from '~/utils/google-analytics'
import { setIntersectionObserver } from '~/utils/intersection-observer'
import Swiper from '~/components/Swiper'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import FacebookPagePlugin from '~/components/FacebookPagePlugin.vue'
import IframeEmbedYoutube from '~/components/IframeEmbedYoutube.vue'
import IframeYoutube from '~/components/IframeYoutube.vue'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'
import UiFlashNews from '~/components/UiFlashNews'

import { fetchEditorChoices } from '~/apollo/queries/editorChoices.gql'

const pageSize = 12

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
        first: pageSize,
        skip: 0,
        withCount: true,
        withCoverPhoto: true,
      },
      update(data) {
        this.postsCount = data._allPostsMeta?.count
        return data.allPosts
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
  },
  components: {
    Swiper,
    HeadingBordered,
    ArticleCard,
    ButtonLoadmore,
    FacebookPagePlugin,
    IframeEmbedYoutube,
    IframeYoutube,
    LinkYoutubeStyle,
    UiFlashNews,
  },
  data() {
    return {
      allPublishedPosts: [],
      editorChoices: [],
      flashNews: [],
      page: 0,
      playlistItems: [],
      postsCount: 0,
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
    showEditorChoices() {
      return this.editorChoices?.length > 0
    },
    latestPosts() {
      const listData = this.allPublishedPosts ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },
    showLoadMoreButton() {
      return pageSize * (this.page + 1) < this.postsCount
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
    getImageUrl(post) {
      if (post.style === 'videoNews') {
        const coverPhoto = post.heroVideo?.coverPhoto
        return coverPhoto?.urlMobileSized || coverPhoto?.urlOriginal
      }
      return post.heroImage?.urlMobileSized
    },
    reducerArticleCard(post) {
      return {
        id: post.id,
        href: `/story/${post.slug}`,
        labelTitle: post.categories?.[0]?.name ?? ' ',
        articleImgURL: this.getImageUrl(post),
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
        articleStyle: post.style,
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('home')('click')(label)
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPublishedPosts.fetchMore({
        variables: {
          first: pageSize,
          skip: pageSize * this.page,
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
.home {
  > * + .main {
    margin-top: 16px;
  }
  &__heading {
    width: 110px;
    + * {
      margin-top: 16px;
    }
  }
}

.main {
  &__flash-news {
    width: calc(100% + 16px);
    transform: translateX(-8px);
    @include media-breakpoint-up(md) {
      width: auto;
      transform: none;
    }
    + * {
      margin-top: 16px;
      @include media-breakpoint-up(md) {
        margin-top: 30px;
      }
    }
  }
  &__live-stream {
    margin: 48px 0 0;
    @include media-breakpoint-up(xxl) {
      display: none;
    }
  }
  &__aside,
  &__list-latest-wrapper {
    margin-top: 48px;
  }
  &__aside {
    @include media-breakpoint-up(xxl) {
      margin-top: 0;
      background-color: #e7e7e7;
    }
    > * + .heading-bordered-wrapper {
      margin-top: 40px;
    }
  }
  .editor-choices-wrapper {
    width: calc(100% + 32px);
    transform: translateX(-16px);
    &__heading {
      display: none;
    }
    &::v-deep {
      .article-img-wrapper {
        padding-top: 56.25%;
      }
      @include media-breakpoint-up(md) {
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
    @include media-breakpoint-up(md) {
      width: auto;
      transform: none;
      &__heading {
        display: inline-block;
      }
    }
  }
}

.aside {
  &__live-stream {
    display: none;
    @include media-breakpoint-up(xxl) {
      display: block;
    }
  }
}

.live-stream {
  * + .home__heading {
    margin: 40px 0 0;
  }
  .iframe-wrapper + .iframe-wrapper {
    margin-top: 16px;
  }
}

.list-latest-wrapper {
  &__button-load-more {
    margin: 24px 0 0;
  }
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
      margin: 20px 15px 0;
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
  @include media-breakpoint-up(xxl) {
    width: calc(100% + 24px);
    transform: translateX(-12px);
    li {
      width: calc((100% - 72px) / 3);
      margin: 20px 12px 0;
    }
  }
}

.button-load-more {
  width: 100%;
  @include media-breakpoint-up(xxl) {
    display: block;
    width: 300px;
    margin: 32px auto 0;
  }
}
</style>
