<template>
  <section class="g-page g-page--with-aside story" :isVideoNews="isVideoNews">
    <div class="g-page__wrapper">
      <main class="main">
        <template v-if="isVideoNews">
          <div class="post__hero">
            <ClientOnly>
              <YoutubeEmbedByIframeApi
                v-if="heroVideoUrl"
                :videoId="heroVideoUrl"
              />
            </ClientOnly>
            <p class="figcaption" v-text="imageCaption" />
          </div>
        </template>
        <template v-else>
          <figure v-if="image.mobile" class="post__hero">
            <div class="post__hero_image_wrapper">
              <img
                v-lazy="image.mobile"
                :alt="imageCaption"
                :data-srcset="`${image.mobile} 0w, ${image.desktop} 1200vw`"
                sizes="(max-width: 1199px) 100vw, 500px"
              />
            </div>
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
        <div v-if="showBrief" class="post__brief">
          <template v-if="isBriefString">
            {{ brief }}
          </template>
          <template v-else>
            <ArticleContentHandler
              v-for="paragraph in brief"
              :key="paragraph.id"
              :paragraph="paragraph"
            />
          </template>
        </div>

        <article itemprop="articleBody" class="post__content">
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

        <div v-if="pdfUrl" class="post__iframe">
          <ClientOnly>
            <iframe :src="pdfUrl">
              <p>抱歉，您的裝置不支援此瀏覽形式</p>
            </iframe>
          </ClientOnly>
        </div>

        <div v-if="hasTags" class="post__tags">
          <ArticleTag
            v-for="tag in tags"
            :key="tag.name"
            :tag="tag"
            class="post__tag"
            @click.native="sendGaClickEvent('tag')"
          />
        </div>
        <ClientOnly>
          <LazyRenderer
            id="_popIn_recommend"
            @load="handleLoadPopinWidget"
          ></LazyRenderer>
        </ClientOnly>
        <ListArticleRelated
          v-if="hasRelatedPosts"
          :listData="relatedPosts"
          @click-item="sendGaClickEvent('related articles')"
        >
          <template #ads>
            <ClientOnly>
              <LazyRenderer
                id="_popIn_recommend_word"
                @load="handleLoadPopinWidget"
              ></LazyRenderer>
              <div class="dable-widget-innerText">
                <LazyRenderer
                  id="dablewidget_2o2ZAAoe_Ql9RwYX4"
                  data-widget_id-pc="2o2ZAAoe"
                  data-widget_id-mo="Ql9RwYX4"
                  @load="handleLoadDableWidget"
                ></LazyRenderer>
              </div>
            </ClientOnly>
          </template>
        </ListArticleRelated>
        <ClientOnly>
          <div class="dable-widget-last">
            <LazyRenderer
              id="dablewidget_2Xnxwk7d_xXAWmB7G"
              data-widget_id-pc="2Xnxwk7d"
              data-widget_id-mo="xXAWmB7G"
              @load="handleLoadDableWidget"
            ></LazyRenderer>
          </div>
        </ClientOnly>
      </main>
      <aside class="g-aside aside">
        <ListArticleAside
          class="aside__list-popular"
          :listTitle="'熱門新聞'"
          :listData="listArticleAsidepopularData"
        />
        <ListArticleAside
          class="aside__list-latest"
          :listTitle="'最新新聞'"
          :listData="listArticleAsideLatestData"
        />
      </aside>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  FILTERED_SLUG,
} from '~/constants'

import { getUrlOrigin } from '~/utils/meta'
import { getPdfUrl } from '~/utils/story_pdf'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleError } from '~/utils/error-handler'
import { handleYoutubeId } from '~/utils/text-handler'
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
import { getImageUrl } from '~/utils/post-image-handler'

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
      update(data) {
        if (!data.postPublished?.[0]?.name) {
          this.has404Err = true
        }
        return data.postPublished?.[0]
      },
      error(error) {
        handleError(this.$nuxt, error.networkError.statusCode)
      },
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5,
        filteredSlug: FILTERED_SLUG,
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
  data() {
    return {
      postPublished: {},
      allPostsLatest: [],
      popularData: {},
      has404Err: false,
      shouldLoadPopinScript: false,
      shouldLoadDableScript: false,
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchGcsData('/popularlist')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  },
  head() {
    const title = this.title
    // const brief = this.brief?.replace?.(/<[^>]*>?/gm, '')
    const brief = this.generateBriefText()
    const tags = this.tags?.map?.((tag) => tag.name).join(', ')
    const image = this.image?.desktop
    // dable 圖片有大小限制，如果 mobile 過大，可換成 tiny
    const dableImage = this.image?.mobile
    const ogUrl = `${getUrlOrigin(this.$config)}${this.$route.path}`
    const writerName = this.writers?.[0] ?? ''
    const publishedDateIso = new Date(this.publishTime).toISOString()
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
        { property: 'dable:item_id', content: this.slug },
        { property: 'dable:author', content: writerName },
        { property: 'dable:image', content: dableImage },
        { property: 'article:section', content: this.categoryName },
        { property: 'article:published_time', content: publishedDateIso },
      ],
      script: [
        ...generateJsonLds.bind(this)(),
        {
          hid: 'dable',
          skip: !this.shouldLoadDableScript,
          innerHTML: `
            (function(d,a,b,l,e,_) {
              d[b] = d[b] || function () {
                (d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
            dable('setService', 'mnews.tw')
            dable('sendLogOnce')
            dable('renderWidgetByWidth', 'dablewidget_2Xnxwk7d_xXAWmB7G')
            dable('renderWidgetByWidth', 'dablewidget_2o2ZAAoe_Ql9RwYX4')
          `,
        },
        {
          hid: 'popinAd',
          skip: !this.shouldLoadPopinScript,
          innerHTML: `
            (function() {
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true
              pa.src = window.location.protocol + '//api.popin.cc/searchbox/mnews_tw.js'
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
            })()
          `,
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        dable: ['innerHTML'],
        popinAd: ['innerHTML'],
      },
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
            url: `${getUrlOrigin(this.$config)}/author/${
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
            item: `${getUrlOrigin(this.$config)}/category/${
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
        const briefString = this.postPublished?.briefApiData.replace(/'/g, '"')
        const brief = JSON.parse(briefString)
        return brief?.filter((item) => item) || []
      } catch {
        return []
      }
    },
    showBrief() {
      const validateArray = this.brief?.map((briefContent) => {
        return (
          briefContent?.content?.length > 1 ||
          briefContent?.content[0]?.length > 0
        )
      })

      return validateArray.find((item) => {
        return item
      })
    },
    categoryTitle() {
      return this.postPublished?.categories?.[0]?.name
    },
    cameraOperators() {
      return this.postPublished?.cameraOperators
    },
    content() {
      try {
        const contentString = this.postPublished?.contentApiData.replace(
          /'/g,
          '"'
        )
        const content = JSON.parse(contentString)

        return content?.filter((item) => item) || []
      } catch {
        return []
      }
    },
    heroVideoUrl() {
      const url = this.postPublished?.heroVideo?.youtubeUrl ?? ''
      return url ? handleYoutubeId(url) : ''
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
      return (
        this.postPublished?.heroImage ?? {
          tiny: require('~/assets/img/image-default.png'),
          mobile: require('~/assets/img/image-default.png'),
          desktop: require('~/assets/img/image-default.png'),
        }
      )
    },
    imageCaption() {
      return this.postPublished?.heroCaption
    },
    isBriefString() {
      return typeof this.brief === 'string'
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
    listArticleAsidepopularData() {
      const listData = this.popularData?.report ?? []
      return listData
        .filter((item, i) => i < 5)
        .map((report) => this.reducerArticleCard(report))
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
    categoryName() {
      return this.postPublished?.categories?.[0]?.name ?? ''
    },
    source() {
      return this.postPublished?.source
    },
    pdfUrl() {
      return getPdfUrl(this.$config, this.slug)
    },
  },
  beforeMount() {
    this.setGaDimensionOfSource()
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
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
      return `${dayjs(date).format('YYYY.MM.DD HH:mm')} 臺北時間`
    },
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: getImageUrl(post),
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
      }
    },
    handleLoadPopinWidget() {
      this.shouldLoadPopinScript = true
    },
    handleLoadDableWidget() {
      this.shouldLoadDableScript = true
    },
    generateBriefText() {
      const rawText = this.brief?.[0]?.content?.[0] ?? ''
      return rawText.includes('&#') ? undefined : rawText
    },
    setGaDimensionOfSource() {
      const dimensionSource = this.source ?? ''
      this.$ga.set('dimension1', dimensionSource)
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
  @include media-breakpoint-up(md) {
    padding-top: 36px;
  }
  .main {
    margin: 0 auto;
    @include media-breakpoint-up(md) {
      max-width: 600px;
    }
  }
  .g-aside {
    @include media-breakpoint-up(xl) {
      padding: 24px 32px 53px;
    }
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
    &_image_wrapper {
      width: 100%;
      padding-top: 56.25%;
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
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
    margin: 8px 0 0;
    color: #000;
    font-size: 32px;
    font-weight: 500;
    + * {
      margin-top: 8px;
    }
  }

  &__social-media-share {
    display: flex;
    align-items: center;
    .share + .share {
      margin-left: 12px;
    }
  }
  &__tags {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 10px);
    margin-top: 25px;
    transform: translateX(-5px);
    + * {
      margin-top: 48px;
    }
  }
  &__brief {
    display: inline-block;
    margin: 30px 0 0;
    padding: 24px 10px;
    color: $color-blue !important;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.63 !important;
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
    ::v-deep {
      > * + * {
        margin-top: 30px;
      }
    }
    > p {
      color: $color-blue !important;
    }
  }
  &__credit {
    margin-bottom: 12px;
    p {
      display: inline-block;
      margin-right: 12px;
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
  &__iframe {
    width: 100%;
    margin-bottom: 48px;
    iframe {
      width: 100%;
      height: 75vh;
      @include media-breakpoint-up(md) {
        height: calc(600px * 4 / 3 + 80px);
      }
    }
  }
  &__tag {
    margin: 0 5px;
    padding: 8px 0;
  }
}

.dable-widget-last {
  margin: 40px 0 0;
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

  &__list-popular,
  &__list-latest {
    margin-top: 48px;
    margin-bottom: 0;
    // tablet range
    @include media-breakpoint-up(md) {
      &:first-child {
        margin-right: 16px;
      }
    }
    // desktop range
    @include media-breakpoint-up(xl) {
      padding: 0 !important;
      &:first-child {
        margin-right: 0;
      }
    }
  }

  &__list-popular {
    @include media-breakpoint-up(xl) {
      margin-top: 0;
    }
  }

  & .list-title {
    margin-top: 30px !important;
  }
}

[isVideoNews='true'] {
  padding-bottom: 8px;
}
</style>
