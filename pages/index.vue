<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main>
        <div>
          <H1Bordered :text="'最新文章'" />
          <ol class="list-latest">
            <li v-for="post in latestPosts" :key="post.id">
              <ArticleCard
                :href="post.href"
                :labelTitle="post.labelTitle"
                :articleImgURL="post.articleImgURL"
                :articleTitle="post.articleTitle"
                :articleDate="post.articleDate"
              />
            </li>
          </ol>
        </div>
      </main>
      <aside>
        <IframeFacebookPagePlugin />
      </aside>
    </div>
  </section>
</template>

<script>
import IframeFacebookPagePlugin from '~/components/IframeFacebookPagePlugin.vue'
import H1Bordered from '~/components/H1Bordered'
import ArticleCard from '~/components/ArticleCard'
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'

export default {
  apollo: {
    allPublishedPosts: {
      query: allPublishedPosts
    }
  },
  components: {
    IframeFacebookPagePlugin,
    H1Bordered,
    ArticleCard
  },
  computed: {
    latestPosts() {
      return this.allPublishedPosts.map((post) => this.reducerArticleCard(post))
    }
  },
  methods: {
    reducerArticleCard(post) {
      return {
        id: post.id,
        href: `/story/${post.slug}`,
        labelTitle: post.Category?.[0]?.title ?? ' ',
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

aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 60px 40px;
    background-color: #e7e7e7;
  }
}
</style>
