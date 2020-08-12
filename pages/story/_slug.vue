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
          <p v-if="writers">作者｜{{ writers }}</p>
          <p v-if="photographers">攝影｜{{ photographers }}</p>
          <p v-if="cameraOperators">影音｜{{ cameraOperators }}</p>
          <p v-if="designers">設計｜{{ designers }}</p>
          <p v-if="engineers">工程｜{{ engineers }}</p>
          <p v-if="vocals">主播｜{{ vocals }}</p>
        </div>
        <div class="post__social-media-share">
          <ShareFacebook />
          <ShareLine />
        </div>
        <div v-if="brief" class="post__brief" v-html="brief" />
        <article class="post__content">
          <ArticleContentParagraph
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
          />
        </div>
        <div v-if="hasRelatedPosts" class="post__related-posts">
          <HeadingBordered text="相關文章" />
          <ul>
            <li
              v-for="post in relatedPosts"
              :key="post.slug"
              class="post__related"
            >
              <a
                :href="`/story/${post.slug}`"
                target="_blank"
                rel="noopener noreferrer"
                v-text="post.title"
              />
            </li>
          </ul>
        </div>
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
import ArticleContentParagraph from '~/components/ArticleContentParagraph.vue'
import ArticleTag from '~/components/ArticleTag.vue'
import HeadingBordered from '~/components/HeadingBordered'
import ListArticleAside from '~/components/ListArticleAside'
import ShareFacebook from '~/components/ShareFacebook'
import ShareLine from '~/components/ShareLine'

import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'
import postPublished from '~/apollo/queries/postPublished.gql'

export default {
  apollo: {
    postPublished: {
      query: postPublished,
      variables() {
        return {
          slug: this.$route.params.slug
        }
      }
    },
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 5
      },
      update: (data) => data.allPublishedPosts
    },
    allPostsLatestMeta: {
      query: allPublishedPosts,
      update: (data) => data.meta
    }
  },
  components: {
    ArticleContentParagraph,
    ArticleTag,
    HeadingBordered,
    ListArticleAside,
    ShareFacebook,
    ShareLine
  },
  computed: {
    brief() {
      try {
        const brief = JSON.parse(this.postPublished?.[0]?.brief)
        return brief?.html
      } catch {
        return ''
      }
    },
    categoryTitle() {
      return this.postPublished?.[0]?.categories?.[0]?.title
    },
    cameraOperators() {
      return this.postPublished?.[0]?.cameraOperators
        .map((item) => item.name)
        .join('、')
    },
    content() {
      try {
        const content = JSON.parse(this.postPublished?.[0]?.content)
        return content.apiData.filter((item) => item)
      } catch {
        return []
      }
    },
    designers() {
      return this.postPublished?.[0]?.designers
        .map((item) => item.name)
        .join('、')
    },
    engineers() {
      return this.postPublished?.[0]?.engineers
        .map((item) => item.name)
        .join('、')
    },
    hasPostsLatest() {
      return this.allPostsLatest.length > 0
    },
    hasPostsLatestMore() {
      return this.allPostsLatestMeta.count > 5
    },
    hasRelatedPosts() {
      return this.relatedPosts?.length > 0
    },
    hasTags() {
      return this.tags?.length > 0
    },
    image() {
      return this.postPublished?.[0]?.heroImage ?? {}
    },
    imageCaption() {
      return this.postPublished?.[0]?.heroCaption
    },
    listArticleAsideLatestData() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },
    listArticleAsideLatestMoreTo() {
      return this.hasPostsLatestMore ? '/latest' : undefined
    },
    publishTime() {
      return this.postPublished?.[0]?.publishTime
    },
    photographers() {
      return this.postPublished?.[0]?.photographers
        .map((item) => item.name)
        .join('、')
    },
    relatedPosts() {
      return this.postPublished?.[0]?.relatedPosts
    },
    tags() {
      return this.postPublished?.[0]?.tags
    },
    title() {
      return this.postPublished?.[0]?.title
    },
    vocals() {
      return this.postPublished?.[0]?.vocals.map((item) => item.name).join('、')
    },
    writers() {
      return this.postPublished?.[0]?.writers
        .map((item) => item.name)
        .join('、')
    }
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
        articleDate: new Date(post.publishTime)
      }
    }
  }
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
  &__related-posts {
    ul {
      margin-top: 12px;
    }
  }
  &__related {
    position: relative;
    padding: 8px 0 8px 20px;
    border-bottom: 1px solid #d8d8d8;
    &::before {
      content: '';
      position: absolute;
      top: 18px;
      left: 0;
      display: inline-block;
      width: 7px;
      height: 7px;
      background-color: #d8d8d8;
      border-radius: 50%;
    }
    a {
      color: #4a4a4a;
      font-size: 16px;
      word-break: break-word;
      overflow-wrap: break-word;
    }
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
