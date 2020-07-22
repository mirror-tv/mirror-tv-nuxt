<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main>
        <div>
          <H1Bordered class="list-latest-title" :text="pageName" />
          <ol class="list-latest">
            <li
              v-for="(post, i) in allPosts"
              :key="post.id"
              class="list-latest__list-item list-latest-list-item"
            >
              <ArticleCardFeatured
                v-if="i === 0"
                class="list-latest-list-item__featured"
                :href="reducerArticleCard(post).href"
                :articleImgURL="reducerArticleCard(post).articleImgURL"
                :articleTitle="reducerArticleCard(post).articleTitle"
                :articleDate="reducerArticleCard(post).articleDate"
              />
              <ArticleCard
                v-else
                :href="reducerArticleCard(post).href"
                :articleImgURL="reducerArticleCard(post).articleImgURL"
                :articleTitle="reducerArticleCard(post).articleTitle"
                :articleDate="reducerArticleCard(post).articleDate"
                :mobileLayoutDirection="'column'"
              />
            </li>
          </ol>
        </div>
      </main>
      <aside></aside>
    </div>
  </section>
</template>

<script>
import H1Bordered from '~/components/H1Bordered'
import ArticleCardFeatured from '~/components/ArticleCardFeatured'
import ArticleCard from '~/components/ArticleCard'

import publishedPostsByCategoryTitle from '~/apollo/queries/publishedPostsByCategoryTitle.gql'

export default {
  apollo: {
    allPosts: {
      query: publishedPostsByCategoryTitle,
      variables() {
        return {
          categoryTitle: this.pageName
        }
      }
    }
  },
  components: {
    H1Bordered,
    ArticleCardFeatured,
    ArticleCard
  },
  computed: {
    pageName() {
      return this.$route.params.name
    }
  },
  methods: {
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
  min-height: 100vh;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 380;
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
  }
}

main {
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 60px 0 50px 0;
  }
}

.list-latest-title {
  min-width: 110px;
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
    &:first-child {
      width: 100vw;
      position: relative;
      left: -20px;
      @include media-breakpoint-up(xl) {
        width: auto;
        left: 0;
      }
    }
  }
}

aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 60px 40px;
    /*background-color: #e7e7e7;*/
  }
}
</style>
