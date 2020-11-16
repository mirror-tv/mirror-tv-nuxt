<template>
  <section class="page">
    <div class="max-width-wrapper">
      <EditorChoices :items="allEditorChoices" class="editor-choices">
        <HeadingBordered text="編輯精選" />
      </EditorChoices>
      <main class="main">
        <div class="category-posts-wrapper">
          <div
            v-for="category in allCategories"
            :key="category.slug"
            class="category-posts"
          >
            <div>
              <HeadingBordered
                class="category-posts__heading"
                :text="category.title"
              />
              <a
                :href="`/category/${category.slug}`"
                class="category-posts__link"
                target="_blank"
                rel="noopener noreferrer"
              />
            </div>
            <ArticleListSlides
              :items="getPostsByCategory(category.slug).items"
              :total="getPostsByCategory(category.slug).total"
              class="category-posts__posts"
              @load-more="handleLoadMorePostsByCategory(category.slug, $event)"
            />
          </div>
        </div>
      </main>
      <aside class="max-width-wrapper__aside">
        <FacebookPagePlugin />
      </aside>
    </div>
  </section>
</template>

<script>
import ArticleListSlides from '~/components/ArticleListSlides'
import EditorChoices from '~/components/EditorChoices'
import HeadingBordered from '~/components/HeadingBordered'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'

import allCategories from '~/apollo/queries/allCategories.gql'
import allEditorChoices from '~/apollo/queries/allEditorChoices.gql'
import { postsByCategorySlug } from '~/apollo/queries/allPublishedPostsByCategorySlug.gql'

export default {
  name: 'VideoCategory',
  apollo: {
    allCategories: {
      query: allCategories,
      update: (data) =>
        data?.allCategories.filter((category) => category.slug !== 'video'),
    },
    allEditorChoices: {
      query: allEditorChoices,
      update: (data) => {
        return data.allEditorChoices.map((item) => item.choice)
      },
    },
  },
  components: {
    ArticleListSlides,
    EditorChoices,
    HeadingBordered,
    FacebookPagePlugin,
  },
  computed: {
    categoriesSlug() {
      return this.allCategories.map((category) => category.slug)
    },
  },
  mounted() {
    if (this.categoriesSlug.length > 0) {
      this.fetchPostsByCategory()
    }
  },
  methods: {
    fetchPostsByCategory() {
      this.categoriesSlug.forEach((slug) => {
        this.$apollo.addSmartQuery(`${slug}Posts`, {
          query: postsByCategorySlug,
          variables: () => ({ category: slug }),
          update: (rawData) => {
            const data = {
              items: rawData.posts || [],
              total: rawData.meta.count || 0,
            }
            this[`${slug}Posts`] = data
            return data
          },
        })
      })
    },
    getPostsByCategory(slug) {
      const data = this[`${slug}Posts`]
      return { items: data?.items ?? [], total: data?.total ?? 0 }
    },
    handleLoadMorePostsByCategory(slug, page) {
      this.$apollo.queries?.[`${slug}Posts`]?.fetchMore({
        variables: {
          category: slug,
          skip: page * 10,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.$set(this[`${slug}Posts`], 'items', [
            ...previousResult.posts,
            ...fetchMoreResult.posts,
          ])
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
  min-height: 100vh;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 339;
$mainWidthDesktop: $maxWidthDesktop - $asideWidthDesktop;
.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 80px 20px 50px;
  @include media-breakpoint-up(xl) {
    align-items: flex-start;
    padding: 0;
    max-width: #{$maxWidthDesktop}px;
    margin: 0 auto;
    flex-direction: row;
    flex-wrap: wrap;
  }
  &__aside {
    margin: 20px 0 0;
    @include media-breakpoint-up(xl) {
      width: #{$asideWidthDesktop}px;
      padding: 0 0 0 39px;
      margin: 49px 0 0;
      border-left: 1px solid #d8d8d8;
    }
  }
}

.main {
  margin: 49px 0 0;
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 0 28px 50px 0;
  }
}

.editor-choices {
  @include media-breakpoint-up(xl) {
    margin: 22px 0 0;
  }
}

.category-posts {
  + .category-posts {
    margin-top: 40px;
    @include media-breakpoint-up(xl) {
      margin-top: 50px;
    }
  }
  &-wrapper {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    @include media-breakpoint-up(xl) {
      left: auto;
      width: auto;
    }
  }
  &__heading {
    width: 110px;
    margin-left: 20px;
    @include media-breakpoint-up(xl) {
      margin-left: 4px;
    }
  }
  &__link {
    display: inline;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      width: 13px;
      height: 13px;
      border: 2px solid#014db8;
      border-color: #014db8#014db8 transparent transparent;
      transform: rotate(45deg);
    }
  }
  &__posts {
    padding: 0 20px;
    margin-top: 20px;
    @include media-breakpoint-up(xl) {
      padding: 0 4px;
    }
  }
}
</style>
