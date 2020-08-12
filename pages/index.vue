<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
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
      <aside class="max-width-wrapper__aside aside">
        <IframeFacebookPagePlugin />
      </aside>
    </div>
  </section>
</template>

<script>
import Swiper from '~/components/Swiper'
import IframeFacebookPagePlugin from '~/components/IframeFacebookPagePlugin.vue'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import ButtonLoadmore from '~/components/ButtonLoadmore.vue'
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'
import allPublishedEditorChoices from '~/apollo/queries/allPublishedEditorChoices.gql'

const pageSize = 12

export default {
  apollo: {
    allPublishedEditorChoices: {
      query: allPublishedEditorChoices
    },
    allPublishedPosts: {
      query: allPublishedPosts,
      variables: {
        first: pageSize,
        skip: 0
      }
    },
    allPublishedPostsMeta: {
      query: allPublishedPosts,
      update: (data) => data.meta
    }
  },
  components: {
    Swiper,
    IframeFacebookPagePlugin,
    HeadingBordered,
    ArticleCard,
    ButtonLoadmore
  },
  data() {
    return {
      page: 0
    }
  },
  computed: {
    showEditorChoices() {
      return (this.allPublishedEditorChoices ?? []).length > 0
    },
    editorChoices() {
      const listData = this.allPublishedEditorChoices ?? []
      return listData
        .map((post) => post.choice ?? {})
        .map((post) => this.reducerArticleCard(post))
    },
    latestPosts() {
      const listData = this.allPublishedPosts ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },
    showLoadMoreButton() {
      return pageSize * (this.page + 1) < this.allPublishedPostsMeta?.count
    }
  },
  methods: {
    reducerArticleCard(post) {
      return {
        id: post.id,
        href: `/story/${post.slug}`,
        labelTitle: post.categories?.[0]?.title ?? ' ',
        articleImgURL: post.heroImage?.urlMobileSized,
        articleTitle: post.title,
        articleDate: new Date(post.publishTime)
      }
    },
    handleClickMore() {
      this.page += 1
      this.$apollo.queries.allPublishedPosts.fetchMore({
        variables: {
          first: pageSize,
          skip: pageSize * this.page
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.allPublishedPosts
          return {
            allPublishedPosts: [
              ...previousResult.allPublishedPosts,
              ...newPosts
            ]
          }
        }
      })
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

.aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 60px 40px;
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
