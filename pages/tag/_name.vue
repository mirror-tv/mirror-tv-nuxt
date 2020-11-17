<template>
  <section class="g-page">
    <h1 class="g-listing-heading" v-text="routeName" />
    <p v-if="!hasItems">目前沒有相關的文章</p>
    <ol v-else class="list-container">
      <li v-for="post in posts" :key="post.slug" class="item">
        <ArticleCard
          :href="post.href"
          :articleImgURL="post.image"
          :articleTitle="post.title"
          :articleDate="post.publishTime"
          mobileLayoutDirection="column"
        />
      </li>
    </ol>
    <ButtonLoadmore class="button-load-more" @click.native="handleLoadMore" />
  </section>
</template>

<script>
import { fetchPostsByTagName } from '~/apollo/queries/posts.gql'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'

export default {
  name: 'TagPage',
  components: {
    ArticleCard,
    ButtonLoadmore,
  },
  apollo: {
    posts: {
      query: fetchPostsByTagName,
      variables() {
        return {
          tagName: this.routeName,
        }
      },
      update(data) {
        return data.allPosts?.map(this.restructurePost)
      },
      error() {
        this.$nuxt.error({ statusCode: 500 })
      },
    },
  },
  computed: {
    hasItems() {
      return this.posts?.length > 0
    },
    routeName() {
      return this.$route.params.name
    },
  },
  methods: {
    handleLoadMore() {},
    restructurePost(post) {
      return {
        href: `/story/${post.slug}`,
        slug: post.slug,
        title: post.title,
        image: post.heroImage?.urlMobileSized,
        publishTime: new Date(post.publishTime),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.list-container {
  @include media-breakpoint-up(lg) {
    display: flex;
    flex-wrap: wrap;
    max-width: 826px;
  }
  .item {
    @include media-breakpoint-up(lg) {
      margin: 30px 13px 0;
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        margin-top: 0 !important;
      }
    }
    + .item {
      margin: 20px 0 0;
      @include media-breakpoint-up(lg) {
        margin: 30px 13px 0;
      }
    }
  }
}

.button-load-more {
  display: block;
  width: 100%;
  margin: 20px auto 0;
  @include media-breakpoint-up(lg) {
    width: 300px;
    margin: 60px auto 0;
  }
}
</style>
