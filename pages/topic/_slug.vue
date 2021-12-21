<template>
  <div class="g-page topic">
    <div
      class="topic__hero"
      :style="{
        backgroundImage: `url(${topicImage})`,
        opacity: isMounted ? 1 : 0,
      }"
    >
      <div v-if="shouldShowSlide" class="slide">
        <div class="slide-bg" />
        <UiTopicSwiper
          :slideshow="slideshow"
          :multivideo="multivideo"
          :isVideo="isVideo"
          class="swiper"
        />
      </div>
      <div v-if="shouldShowHeroVideo" class="video-wrapper">
        <div v-if="doeshaveYoutubeUrl" class="video">
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              :enableAutoplay="true"
              :videoId="youtubeId"
            />
          </ClientOnly>
        </div>
        <ArticleContentVideo
          v-else
          :shouldAutoPlay="true"
          :video="topicVideo"
          class="video"
        />
      </div>
    </div>
    <div v-show="isMounted" class="topic__content">
      <div class="topic__content__header">
        <h2>{{ topicName }}</h2>
        <UiTopicSocialLinks
          :fbUrl="topic.facebook"
          :igUrl="topic.instagram"
          :lineUrl="topic.line"
          class="social-links"
        />
      </div>
      <ul>
        <li v-for="post in formatedPosts" :key="post.id">
          <UiSingleTopicListingCard
            :href="post.href"
            :title="post.title"
            :image="post.image.src"
            :categoryName="post.categoryName"
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
import _ from 'lodash'
import InfiniteLoading from 'vue-infinite-loading'
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { handleYoutubeId } from '~/utils/content-handler'
import UiTopicSwiper from '~/components/UiTopicSwiper'
import UiTopicSocialLinks from '~/components/UiTopicSocialLinks'
import ArticleContentVideo from '~/components/ArticleContentVideo'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import UiSingleTopicListingCard from '~/components/UiSingleTopicListingCard'
import { fetchPostsByTopicSlug } from '~/apollo/queries/topic.gql'

const PAGE_SIZE = 12

export default {
  components: {
    InfiniteLoading,
    UiTopicSwiper,
    UiTopicSocialLinks,
    YoutubeEmbedByIframeApi,
    ArticleContentVideo,
    UiSingleTopicListingCard,
  },
  apollo: {
    topic: {
      query: fetchPostsByTopicSlug,
      variables() {
        return {
          topicSlug: this.currentSlug,
          first: PAGE_SIZE,
          withCount: true,
        }
      },
      update(data) {
        const item = data?.topic?.[0] || {}
        if (!item.title) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }

        const { items, meta } = data?.topic?.[0] || {}

        return {
          ...data?.topic?.[0],
          items: this.transformPostItems(items),
          meta,
        }
      },
    },
  },
  data() {
    return {
      topic: {
        heroImage: {},
        title: '',
        sortDir: 'asc',
        items: [],
        meta: {
          count: 0,
        },
        isLoading: false,
      },
      youtubeId: '',
      doeshaveYoutubeUrl: false,
      has404Err: false,
      isMounted: false,
    }
  },
  head() {
    const title = `${this.topicName} - ${SITE_NAME}`
    const image =
      this.topicImage || require('~/assets/img/default/image-default.jpg')
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
        ...(image
          ? [
              {
                hid: 'og:image',
                property: 'og:image',
                content: image,
              },
              {
                hid: 'twitter:image',
                name: 'twitter:image',
                content: image,
              },
            ]
          : []),
      ],
    }
  },
  computed: {
    currentSlug() {
      return this.$route.params.slug ?? ''
    },
    topicName() {
      return this.topic?.title ?? ''
    },
    leading() {
      return this.topic?.leading ?? 'image'
    },
    topicImage() {
      return (
        this.topic?.heroImage?.urlDesktopSized ||
        this.topic?.heroImage?.urlTabletSized ||
        require('~/assets/img/default/image-default.jpg')
      )
    },
    topicVideo() {
      const url = this.topic?.heroVideo?.url ?? ''
      return this.handleVideoUrl(url)
    },
    slideshow() {
      return this.topic?.slideshow?.map((post) => {
        const { id = '', slug = '', name = '', heroImage = {} } = post || {}

        return {
          id,
          name,
          href: `/story/${slug}`,
          image:
            heroImage?.urlTabletSized ||
            heroImage?.urlDesktopSized ||
            require('~/assets/img/default/image-default.jpg'),
        }
      })
    },
    multivideo() {
      return this.topic?.multivideo.map((post) => {
        const { id = '', youtubeUrl = '' } = post || {}
        const item = this.handleVideoUrl(youtubeUrl)
        const youtubeId = handleYoutubeId(item.url) || ''

        return { id, youtubeId }
      })
    },
    sortDir() {
      return this.topic?.sortDir ?? 'asc'
    },
    formatedPosts() {
      const sortedData = _.sortBy(this.topic?.items, 'publishTime') ?? []
      return this.sortDir === 'asc' ? sortedData : sortedData.reverse()
    },
    isVideo() {
      return this.leading === 'multivideo'
    },
    shouldShowHeroVideo() {
      return this.leading === 'video' && this.topicVideo
    },
    shouldShowSlide() {
      return (
        (this.leading === 'slideshow' && this.slideshow?.length) ||
        (this.leading === 'multivideo' && this.multivideo?.length)
      )
    },
    shouldMountInfiniteLoading() {
      return this.totalItems > 0
    },
    doesHaveAnyItemsLeftToLoad() {
      return this.totalItems < this.topic?.meta?.count
    },
    totalItems() {
      return this.topic?.items?.length
    },
    shouldShowVideo() {
      return this.topicVideo?.url?.length > 0
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
    this.isMounted = true
  },
  methods: {
    handleVideoUrl(url = '') {
      if (url.includes('youtube') || url.includes('youtu.be')) {
        if (!this.isVideo) {
          this.doeshaveYoutubeUrl = true
          this.youtubeId = url ? handleYoutubeId(url) : ''
        }
      }
      return { url }
    },
    transformPostItems(items = []) {
      return items?.map((post) => {
        const {
          id = '',
          slug = '',
          title = '',
          facebook = '',
          instagram = '',
          line = '',
          heroImage = {},
          categories = [],
        } = post || {}

        return {
          id,
          title,
          href: `/story/${slug}`,
          facebook,
          instagram,
          line,
          image: {
            src:
              heroImage?.urlMobileSized ||
              heroImage?.urlTabletSized ||
              require('~/assets/img/default/image-default.jpg'),
          },
          categoryName: categories?.[0]?.name ?? '',
        }
      })
    },
    async loadMoreItems(state) {
      this.topic.isLoading = true
      try {
        await this.$apollo.queries.topic.fetchMore({
          variables: {
            skip: this.totalItems,
            first: this.PAGE_SIZE,
            topicSlug: this.currentSlug,
            withCount: false,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            return {
              topic: [
                {
                  ...this.topic,
                  items: [
                    ...previousResult.topic[0].items,
                    ...fetchMoreResult.topic[0].items,
                  ],
                  meta: this.topic.meta,
                },
              ],
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
        this.topic.isLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page {
  padding: 50px 16px 48px;
  @include media-breakpoint-up(md) {
    padding: 0 0 48px;
    transform: translateY(-2px);
  }
}
.topic {
  &__hero {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% + 32px);
    height: auto;
    min-height: calc(100vw * 0.75);
    transform: translateX(-16px);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    padding: 12px 0;
    margin: 0 auto 28px;
    @include media-breakpoint-up(md) {
      width: 100%;
      min-height: calc(100vw * 0.4166);
      transform: none;
    }
    .slide {
      width: 100%;
      &-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(50, 50, 50, 0.7);
      }
    }
    .video-wrapper {
      display: block;
      width: 100%;
      max-width: calc(300px + 24px);
      padding: 0 12px;
      @include media-breakpoint-up(md) {
        max-width: 458px;
      }
      @include media-breakpoint-up(xl) {
        max-width: 720px;
      }
      .video {
        width: 100%;
      }
    }
  }
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
    &__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 0 28px;
      h2 {
        display: block;
        font-size: 20px;
        font-weight: 500;
        line-height: 1.6;
        letter-spacing: 0.5px;
        color: $color-blue-deep;
      }
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
