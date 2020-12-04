<template>
  <section class="g-page-with-aside">
    <main class="main">
      <ContactBlock
        :name="contact.name"
        :image="contactImage"
        :facebook="contact.facebook"
        :instatgram="contact.instatgram"
        :profile="contact.bio"
      />
      <div class="posts-count">所有文章（{{ postsCount }}）</div>
      <ArticleCardWithCategory
        v-for="post in posts"
        :key="post.slug"
        :href="post.href"
        :articleTitle="post.title"
        :articleDescription="post.brief"
        :articleImgURL="post.heroImage"
        :articleCategory="post.category"
        :articleDate="post.publishTime"
        class="item"
      />
    </main>
    <aside class="g-aside" />
  </section>
</template>

<script>
import dayjs from 'dayjs'

import { fetchContactBySlug } from '~/apollo/queries/contact.gql'
import { fetchPostsAndCountByAuthorSlug } from '~/apollo/queries/posts.gql'
import ArticleCardWithCategory from '~/components/ArticleCardWithCategory'
import ContactBlock from '~/components/ContactBlock'

export default {
  apollo: {
    contact: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.authorSlug,
        }
      },
      update(data) {
        return data.allContacts?.[0]
      },
    },
    posts: {
      query: fetchPostsAndCountByAuthorSlug,
      variables() {
        return {
          slug: this.authorSlug,
          withCount: true,
        }
      },
      update(data) {
        this.postsCount = data._allPostsMeta.count
        return data.allPosts?.map?.(this.restructurePostFields)
      },
    },
  },
  components: {
    ArticleCardWithCategory,
    ContactBlock,
  },
  data() {
    return {
      postsCount: 0,
    }
  },
  computed: {
    authorSlug() {
      return this.$route.params.slug
    },
    contactImage() {
      return this.contact.image?.urlMobileSized
    },
  },
  methods: {
    restructurePostFields(item) {
      let brief = item.brief
      try {
        brief = JSON.parse(item.brief)?.html?.replace?.(/<[^>]*>?/gm, '')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
      return {
        style: item.style,
        title: item.title,
        href: `/story/${item.slug}`,
        brief,
        publishTime: dayjs(item.publishTime).format('YYYY.MM.DD HH:mm'),
        heroImage: item.heroImage?.urlMobileSized,
        category: item.categories?.[0]?.title,
        test: JSON.parse(item.brief),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  @include media-breakpoint-up(lg) {
    flex: 1;
    padding-right: 118px;
  }
  .item {
    margin: 20px 0 0;
    padding: 10px;
    border: 1px solid #d8d8d8;
    @include media-breakpoint-up(lg) {
      padding: 20px;
    }
    ::v-deep {
      .article-card__img {
        width: 70px;
        height: 70px;
        @include media-breakpoint-up(lg) {
          width: 100px;
          height: 100px;
        }
      }
      .article-title {
        color: #000;
      }
    }
  }
}

.g-aside {
  @include media-breakpoint-up(lg) {
    background-color: #e7e7e7;
  }
}

.posts-count {
  margin: 30px 0 0;
  font-weight: 500;
  text-align: center;
  @include media-breakpoint-up(lg) {
    margin-top: 45px;
  }
}
</style>
