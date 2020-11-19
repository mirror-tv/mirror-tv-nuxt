<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
        <figure v-if="image.mobile" class="post__image">
          <img
            v-lazy="image.mobile"
            :alt="imageCaption"
            :data-srcset="`${image.mobile} 0w, ${image.desktop} 1200vw`"
            sizes="(max-width: 1199px) 100vw, 500px"
          />
          <figcaption v-text="imageCaption" />
        </figure>
        <div class="post__category-publishTime">
          <span class="post__category" v-text="categoryTitle" />
          <span class="post__publishTime" v-text="formatDate(publishTime)" />
        </div>
        <h1 class="post__title" v-text="title" />
        <div class="post__credit">
          <ArticleCredit
            v-for="credit in credits"
            :key="credit.key"
            :contactType="credit.key"
            :contacts="credit.data"
          />
        </div>
        <div class="post__social-media-share">
          <ShareFacebook />
          <ShareLine />
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="brief" class="post__brief" v-html="brief" />
        <article class="post__content">
          <ArticleContentHandler
            v-for="paragraph in content"
            :key="paragraph.id"
            :paragraph="paragraph"
          />
        </article>
        <div v-if="hasTags" class="post__tags">
          <ArticleTag
            v-for="tag in tags"
            :key="tag.name"
            :tag="tag"
            class="post__tag"
            @click.native="sendGaClickEvent('tag')"
          />
        </div>
        <ListArticleRelated
          :listData="relatedPosts"
          @click-item="sendGaClickEvent('related articles')"
        />
      </main>
      <aside class="aside">
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'最新文章'"
          :listData="listArticleAsideLatestData"
          :moreTo="listArticleAsideLatestMoreTo"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { setIntersectionObserver } from '~/utils/intersection-observer'
import ArticleContentHandler from '~/components/ArticleContentHandler.vue'
import ArticleCredit from '~/components/ArticleCredit.vue'
import ArticleTag from '~/components/ArticleTag.vue'
import ListArticleAside from '~/components/ListArticleAside'
import ListArticleRelated from '~/components/ListArticleRelated'
import ShareFacebook from '~/components/ShareFacebook'
import ShareLine from '~/components/ShareLine'

import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'
import { fetchPostPublishedBySlug } from '~/apollo/queries/post.gql'

const CREDIT_KEYS = [
  'writers',
  'photographers',
  'cameraOperators',
  'designers',
  'engineers',
  'vocals',
  'otherbyline',
]

export default {
  apollo: {
    postPublished: {
      query: fetchPostPublishedBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
      update: (data) => data.postPublished?.[0],
      result({ data }) {
        if (!data.postPublished?.[0]?.title) {
          this.$nuxt.error({ statusCode: 404 })
        }
      },
      error() {
        this.$nuxt.error({ statusCode: 500 })
      },
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5,
      },
      update: (data) => data.allPublishedPosts,
    },
    allPostsLatestMeta: {
      query: allPublishedPosts,
      update: (data) => data.meta,
    },
  },
  components: {
    ArticleContentHandler,
    ArticleCredit,
    ArticleTag,
    ListArticleAside,
    ListArticleRelated,
    ShareFacebook,
    ShareLine,
  },
  computed: {
    brief() {
      try {
        const brief = JSON.parse(this.postPublished?.brief)
        return brief?.html
      } catch {
        return ''
      }
    },
    categoryTitle() {
      return this.postPublished?.categories?.[0]?.title
    },
    cameraOperators() {
      return this.postPublished?.cameraOperators
    },
    content() {
      try {
        const content = JSON.parse(this.postPublished?.content)
        return content.apiData.filter((item) => item)
      } catch {
        return []
      }
    },
    credits() {
      return Object.keys(this.postPublished || {})
        .filter(
          (key) =>
            CREDIT_KEYS.includes(key) && this.postPublished?.[key].length > 0
        )
        .map((key) => ({ key, data: this.postPublished[key] }))
    },
    designers() {
      return this.postPublished?.designers
    },
    engineers() {
      return this.postPublished?.engineers
    },
    hasPostsLatest() {
      return this.allPostsLatest.length > 0
    },
    hasPostsLatestMore() {
      return this.allPostsLatestMeta?.count > 5
    },
    hasRelatedPosts() {
      return this.relatedPosts?.length > 0
    },
    hasTags() {
      return this.tags?.length > 0
    },
    image() {
      return this.postPublished?.heroImage ?? {}
    },
    imageCaption() {
      return this.postPublished?.heroCaption
    },
    listArticleAsideLatestData() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },
    listArticleAsideLatestMoreTo() {
      return this.hasPostsLatestMore ? '/latest' : undefined
    },
    otherbyline() {
      return this.postPublished?.otherbyline
    },
    publishTime() {
      return this.postPublished?.publishTime
    },
    photographers() {
      return this.postPublished?.photographers
    },
    relatedPosts() {
      return this.postPublished?.relatedPosts || []
    },
    tags() {
      return this.postPublished?.tags
    },
    title() {
      return this.postPublished?.title
    },
    vocals() {
      return this.postPublished?.vocals
    },
    writers() {
      return this.postPublished?.writers
    },
  },
  mounted() {
    setIntersectionObserver({
      elements: [document.querySelector('.list-wrapper')],
      handler: (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            this.$ga.event({
              eventCategory: 'article',
              eventAction: 'scroll',
              eventLabel: 'to article end',
            })
          }
        })
      },
    })
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    },
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: post.heroImage?.urlMobileSized,
        articleTitle: post.title,
        articleDate: new Date(post.publishTime),
      }
    },
    sendGaClickEvent(label) {
      this.$ga.event({
        eventCategory: 'article',
        eventAction: 'click',
        eventLabel: label,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 380;

.max-width-wrapper {
  padding: 50px 20px 50px;
  @include media-breakpoint-up(xl) {
    display: flex;
    max-width: #{$maxWidthDesktop}px;
    padding: 0;
    margin: 0 auto;
  }
}

.main {
  + * {
    margin-top: 40px;
  }
  @include media-breakpoint-up(xl) {
    width: 500px;
    padding: 50px 0;
    + aside {
      margin: 0 0 0 118px;
    }
  }
}

.post {
  &__image {
    display: block;
    width: calc(100% + 40px);
    transform: translateX(-20px);
    + * {
      margin-top: 30px;
    }
    @include media-breakpoint-up(xl) {
      width: auto;
      transform: none;
    }
    img {
      width: 100%;
    }
    figcaption {
      padding: 10px 20px 0;
      color: #000000;
      font-size: 14px;
      line-height: 1.57;
      @include media-breakpoint-up(xl) {
        padding: 7px 0 0;
      }
    }
  }
  &__category-publishTime {
    display: flex;
    justify-content: space-between;
  }
  &__category {
    color: #014db8;
    font-size: 16px;
    font-weight: 500;
  }
  &__publishTime {
    color: #000000;
    font-size: 14px;
    line-height: 1.57;
    text-align: right;
  }
  &__title {
    margin: 10px 0 0;
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    + * {
      margin-top: 10px;
    }
  }
  &__credit {
    p {
      display: inline-block;
      + p {
        margin-left: 10px;
      }
    }
  }
  &__social-media-share {
    display: flex;
    align-items: center;
    margin: 10px 0 0;
    .share + .share {
      margin-left: 10px;
    }
  }
  &__brief {
    display: inline-block;
    margin: 30px 0 0;
    padding: 24px 10px;
    color: #014db8;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.63;
    text-align: justify;
    border: 3px solid;
    border-image: linear-gradient(
        to bottom,
        #014db8 20%,
        white 20%,
        white 80%,
        #014db8 80%
      )
      5;
  }
  &__content {
    margin: 30px 0 0;
    color: #000000;
    font-size: 16px;
    ::v-deep {
      > * + * {
        margin-top: 30px;
      }
    }
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 10px);
    margin-top: 25px;
    transform: translateX(-5px);
    + * {
      margin-top: 35px;
    }
  }
  &__tag {
    margin: 5px;
  }
}

.aside {
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 50px 0;
    background-color: #e7e7e7;
  }
  &__list-latest {
    @include media-breakpoint-up(xl) {
      padding: 0 30px !important;
      border: none !important;
    }
  }
}
</style>
