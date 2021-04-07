<template>
  <section class="g-page g-page--with-aside">
    <div class="g-page__wrapper">
      <main class="main">
        <template v-if="isVideoNews">
          <div class="post__hero">
            <YoutubeEmbedByIframeApi :videoId="slug" />
            <p class="figcaption" v-text="imageCaption" />
          </div>
        </template>
        <template v-else>
          <figure v-if="image.mobile" class="post__hero">
            <img
              v-lazy="image.mobile"
              :alt="imageCaption"
              :data-srcset="`${image.mobile} 0w, ${image.desktop} 1200vw`"
              sizes="(max-width: 1199px) 100vw, 500px"
            />
            <figcaption class="figcaption" v-text="imageCaption" />
          </figure>
        </template>

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
          <ShareFacebook @click.native="sendGaClickEvent('facebook icon')" />
          <ShareLine @click.native="sendGaClickEvent('line icon')" />
        </div>
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="brief" class="post__brief" v-html="brief" />
        <article class="post__content">
          <template v-if="isContentString">
            {{ content }}
          </template>
          <template v-else>
            <ArticleContentHandler
              v-for="paragraph in content"
              :key="paragraph.id"
              :paragraph="paragraph"
            />
          </template>
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
      <aside class="g-aside aside">
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'最新新聞'"
          :listData="listArticleAsideLatestData"
        />
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'熱門新聞'"
          :listData="listArticleAsideLatestData"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '~/constants'

import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import { setIntersectionObserver } from '~/utils/intersection-observer'
import ArticleContentHandler from '~/components/ArticleContentHandler.vue'
import ArticleCredit from '~/components/ArticleCredit.vue'
import ArticleTag from '~/components/ArticleTag.vue'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
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
        if (!data.postPublished?.[0]?.name) {
          this.$nuxt.error({ statusCode: 404 })
        }
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
      },
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5,
      },
      update: (data) => data.allPublishedPosts,
    },
  },
  components: {
    ArticleContentHandler,
    ArticleCredit,
    ArticleTag,
    YoutubeEmbedByIframeApi,
    ListArticleAside,
    ListArticleRelated,
    ShareFacebook,
    ShareLine,
  },
  head() {
    const title = this.title
    const brief = this.brief?.replace?.(/<[^>]*>?/gm, '')
    const tags = this.tags?.map?.((tag) => tag.name).join(', ')
    const image = this.image?.desktop
    const ogUrl = `${getDomain()}${this.$route.path}`
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: ogUrl,
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
            ]
          : []),
        ...(brief
          ? [
              {
                hid: 'description',
                name: 'description',
                content: brief,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: brief,
              },
            ]
          : []),
        ...(tags
          ? [
              {
                hid: 'news_keywords',
                name: 'news_keywords',
                content: tags,
              },
            ]
          : []),
      ],
      script: [...generateJsonLds.bind(this)()],
    }
    function generateJsonLds() {
      const hasCategory = this.postPublished?.categories?.[0]
      const hasWriter = this.postPublished?.writers?.[0]
      const authorName = hasWriter
        ? this.postPublished?.writers?.[0]?.name
        : SITE_NAME
      const logoUrl = require('~/static/logo.png')
      const jsonLdBreadcrumbList = {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org/',
          '@type': 'BreadcrumbList',
          itemListElement: generateBreadcrumbList.bind(this)(),
        },
      }
      const jsonLdNewsArticle = {
        type: 'application/ld+json',
        json: {
          '@context': 'https://schema.org/',
          '@type': 'NewsArticle',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': ogUrl,
          },
          headline: this.title,
          image,
          datePublished: this.publishTime,
          dateModified: this.postPublished?.updatedAt,
          author: {
            '@type': hasWriter ? 'Person' : 'Organization',
            name: authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: logoUrl,
            },
          },
          description: brief,
          url: ogUrl,
          thumbnailUrl: image,
          articleSection: this.hasCategory ? this.categoryTitle : undefined,
        },
      }
      let jsonLdPerson
      if (hasWriter) {
        jsonLdPerson = {
          type: 'application/ld+json',
          json: {
            '@context': 'http://schema.org/',
            '@type': 'Person',
            name: authorName,
            url: `${getDomain()}/author/${
              this.postPublished?.writers?.[0]?.slug
            }/`,
            brand: {
              '@type': 'Brand',
              name: SITE_NAME,
              url: SITE_URL,
              image: logoUrl,
              logo: logoUrl,
              description: SITE_DESCRIPTION,
            },
          },
        }
      }
      return [
        jsonLdNewsArticle,
        jsonLdBreadcrumbList,
        ...(jsonLdPerson ? [jsonLdPerson] : []),
      ]
      function generateBreadcrumbList() {
        const items = [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: SITE_URL,
          },
        ]
        if (hasCategory) {
          items.push({
            '@type': 'ListItem',
            position: items.length + 1,
            name: this.categoryTitle,
            item: `${getDomain()}/category/${
              this.postPublished?.categories?.[0]?.slug
            }`,
          })
        }
        items.push({
          '@type': 'ListItem',
          position: items.length + 1,
          name: this.title,
          item: ogUrl,
        })
        return items
      }
    }
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
      return this.postPublished?.categories?.[0]?.name
    },
    cameraOperators() {
      return this.postPublished?.cameraOperators
    },
    content() {
      try {
        const content = JSON.parse(this.postPublished?.contentApiData)
        return content?.filter((item) => item) || []
      } catch {
        return []
      }
    },
    credits() {
      return Object.keys(this.postPublished || {})
        .filter(
          (key) =>
            CREDIT_KEYS.includes(key) && this.postPublished?.[key]?.length > 0
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
    isContentString() {
      return typeof this.content === 'string'
    },
    isVideoNews() {
      return this.postPublished?.style === 'videoNews'
    },
    listArticleAsideLatestData() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
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
      return (
        this.postPublished?.relatedPosts?.filter(
          (item) => item.state === 'published'
        ) || []
      )
    },
    slug() {
      return this.$route.params.slug
    },
    tags() {
      return this.postPublished?.tags
    },
    title() {
      return this.postPublished?.name
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
            sendGaEvent(this.$ga)('article')('scroll')('to article end')
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
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
      }
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('article')('scroll')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page--with-aside {
  padding-top: 50px;

  .main {
    max-width: 600px;
    margin: auto;
  }
}

.post {
  &__hero {
    display: block;
    width: calc(100% + 32px);
    transform: translateX(-16px);
    @include media-breakpoint-up(md) {
      width: auto;
      transform: none;
    }
    + * {
      margin-top: 30px;
    }
    img {
      width: 100%;
    }
  }
  &__category-publishTime {
    display: flex;
    justify-content: space-between;
  }
  &__category {
    color: $color-blue;
    font-size: 16px;
    font-weight: 500;
  }
  &__publishTime {
    color: #000;
    font-size: 14px;
    line-height: 1.57;
    text-align: right;
  }
  &__title {
    margin: 10px 0 0;
    color: #000;
    font-size: 32px;
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
    margin: 6px 0 0;
    .share + .share {
      margin-left: 2px;
    }
  }
  &__brief {
    display: inline-block;
    margin: 30px 0 0;
    padding: 24px 10px;
    color: $color-blue;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.63;
    text-align: justify;
    border: 3px solid;
    border-image: linear-gradient(
        to bottom,
        $color-blue 16px,
        white 0,
        white calc(100% - 16px),
        $color-blue 80%
      )
      5;
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
  &__content {
    margin: 30px 0 0;
    color: #000;
    font-size: 16px;
    text-align: justify;
    line-height: 1.75;
    ::v-deep {
      > * + * {
        margin-top: 30px;
      }
    }
  }
  &__tag {
    margin: 0 5px;
    padding: 8px 0;
  }
}

.figcaption {
  padding: 10px 20px 0;
  color: #000;
  font-size: 14px;
  line-height: 1.57;
  @include media-breakpoint-up(md) {
    padding: 7px 0 0;
  }
}

.aside {
  // tablet range
  @include media-breakpoint-up(md) {
    width: 688px;
    display: flex;
    align-items: stretch;
    justify-content: space-between;

    > * {
      + * {
        margin-top: 0;
      }
    }
  }

  // desktop range
  @include media-breakpoint-up(xl) {
    width: 384px;
    display: block;
    background-color: $color-grey;

    > * {
      + * {
        margin-top: 16px;
      }
    }

    ::v-deep {
      .list__list-item {
        .article-img {
          background-color: #fff;
        }
      }
    }
  }
  &__list-latest {
    // tablet range
    @include media-breakpoint-up(md) {
      &:first-child {
        margin-right: 16px;
      }
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      &:first-child {
        margin-right: 0;
      }
    }
  }

  & .list-title {
    margin-top: 30px !important;
  }
}
</style>
