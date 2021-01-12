<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
        <UiFlashNews class="page__flash-news" :articles="flashNews" />
        <div
          v-if="showEditorChoices"
          class="main__editor-choices-wrapper editor-choices-wrapper"
        >
          <HeadingBordered
            class="editor-choices-wrapper__list-title"
            :text="'編輯精選'"
          />
          <Swiper
            class="editor-choices-wrapper__swiper"
            :slidesData="editorChoices"
            @click-slide="sendGaClickEvent('editor choices')"
          />
        </div>
        <div class="main__list-latest-wrapper list-latest-wrapper">
          <HeadingBordered
            class="list-latest-wrapper__list-title"
            :text="'最新文章'"
          />
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
      <aside class="g-aside max-width-wrapper__aside">
        <HeadingBordered text="LIVE" />
        <div class="live-iframe">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/4ZVUmEUFwaY?autoplay=1&mute=1&playsinline=1"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
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
    LinkYoutubeStyle,
    UiFlashNews,
  },
  data() {
    return {
      page: 0,
      postsCount: 0,
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
.page {
  margin: 0 auto;
  min-height: 100vh;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 382;
$mainWidthDesktop: $maxWidthDesktop - $asideWidthDesktop;
.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 50px 20px;
  @include media-breakpoint-up(xl) {
    padding: 0;
    max-width: #{$maxWidthDesktop}px;
    margin: 0 auto;
    flex-direction: row;
    min-height: 100vh;
  }
  &__aside {
    margin: 40px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 0;
    }
  }
}

.main {
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 60px 0 50px 0;
  }
  &__editor-choices-wrapper {
    @include media-breakpoint-up(xl) {
      margin: 0 0 50px 0;
    }
  }
  &__list-latest-wrapper {
    margin: 40px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 0;
    }
  }
}

.page__flash-news {
  margin: 8px 0 16px;
  @include media-breakpoint-up(xl) {
    width: 582px;
    margin: 8px 0 30px;
  }
}

.editor-choices-wrapper {
  display: flex;
  flex-direction: column;
  &__list-title {
    display: none !important;
    @include media-breakpoint-up(xl) {
      display: inline-block !important;
      width: max-content;
    }
  }
  &__swiper {
    width: 100vw;
    position: relative;
    left: -20px;
    @include media-breakpoint-up(xl) {
      margin: 13px 0 0 0 !important;
      width: 582px;
      left: 0;
    }
  }
}

.list-latest-wrapper {
  display: flex;
  flex-direction: column;
  &__list-title {
    width: max-content;
  }
  &__button-load-more {
    align-self: center;
    margin: 20px 0 0 0;
  }
}

.list-latest {
  margin: 20px 0 0 0;
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0 -26px -21px;
  }
  li {
    margin: 0 0 20px 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 26px 21px;
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

.g-aside {
  @include media-breakpoint-up(xl) {
    background-color: #e7e7e7;
  }
}

.button-load-more {
  width: 100%;
  @include media-breakpoint-up(xl) {
    width: 300px;
  }
}
</style>
