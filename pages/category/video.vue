<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
        <div class="category-posts-wrapper">
          <div
            v-for="category in allCategories"
            :key="category.slug"
            class="category-posts"
          >
            <HeadingBordered
              class="category-posts__heading"
              :text="category.title"
            />
            <ArticleListSlides
              :items="getPostsByCategory(category.slug)"
              class="category-posts__posts"
            />
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
import ArticleListSlides from '~/components/ArticleListSlides'
import HeadingBordered from '~/components/HeadingBordered'

import allCategories from '~/apollo/queries/allCategories.gql'
import { postsByCategorySlug } from '~/apollo/queries/allPublishedPostsByCategorySlug.gql'

export default {
  name: 'VideoCategory',
  apollo: {
    allCategories: {
      query: allCategories,
      update: (data) =>
        data?.allCategories.filter((category) => category.slug !== 'video'),
    },
  },
  components: {
    ArticleListSlides,
    HeadingBordered,
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
      const tt = this[`${slug}Posts`]?.items ?? []
      return [...tt, ...tt]
      // return this[`${slug}Posts`]?.items ?? []
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
$asideWidthDesktop: 380;
$mainWidthDesktop: $maxWidthDesktop - $asideWidthDesktop;
.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 80px 20px 50px;
  @include media-breakpoint-up(xl) {
    padding: 0;
    max-width: #{$maxWidthDesktop}px;
    margin: 0 auto;
    flex-direction: row;
  }
}

.main {
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 60px 0 50px 0;
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
  &__posts {
    padding: 0 20px;
    margin-top: 20px;
    @include media-breakpoint-up(xl) {
      padding: 0 4px;
    }
  }
}
</style>
