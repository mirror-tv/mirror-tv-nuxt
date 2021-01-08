<template>
  <section class="page">
    <div class="max-width-wrapper">
      <EditorChoicesVideoNews
        :items="allEditorChoices"
        class="editor-choices"
        @click="sendGaClickEvent('editors choice')"
      >
        <HeadingBordered text="編輯精選" />
      </EditorChoicesVideoNews>
      <main class="main">
        <div class="category-posts-wrapper">
          <div
            v-for="category in categoriesFiltered"
            :key="category.slug"
            class="category-posts"
          >
            <a
              :href="`/category/${category.slug}`"
              target="_blank"
              rel="noopener noreferrer"
              @click="sendGaClickEvent('categories page')"
            >
              <HeadingBordered
                class="category-posts__heading"
                :text="category.name"
              />
              <span class="category-posts__link" />
            </a>
            <ArticleListSlides
              :items="getPostsByCategory(category.slug).items"
              :total="getPostsByCategory(category.slug).total"
              class="category-posts__posts"
              @click-slide-item="sendGaClickEvent('articles')"
              @click-slide-next="
                sendGaClickEvent('right button for more articles')
              "
              @click-slide-prev="
                sendGaClickEvent('left button for more articles')
              "
              @load-more="handleLoadMorePostsByCategory(category.slug, $event)"
            />
          </div>
        </div>
      </main>
      <aside class="g-aside">
        <FacebookPagePlugin />
        <LinkYoutubeStyle />
      </aside>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'

import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import ArticleListSlides from '~/components/ArticleListSlides'
import EditorChoicesVideoNews from '~/components/EditorChoicesVideoNews'
import HeadingBordered from '~/components/HeadingBordered'
import FacebookPagePlugin from '~/components/FacebookPagePlugin'
import LinkYoutubeStyle from '~/components/LinkYoutubeStyle'

import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import { fetchVideoNewsEditorChoices } from '~/apollo/queries/editorChoices.gql'
import { fetchPostsByCategorySlug } from '~/apollo/queries/posts.gql'

export default {
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
      update: (data) =>
        data?.allCategories.filter((category) => category.slug !== 'video'),
    },
    allEditorChoices: {
      query: fetchVideoNewsEditorChoices,
      update: (data) => {
        return data.allEditorChoices
          .filter((item) => item.choice)
          .map((item) => item.choice)
      },
    },
  },
  components: {
    ArticleListSlides,
    EditorChoicesVideoNews,
    HeadingBordered,
    FacebookPagePlugin,
    LinkYoutubeStyle,
  },
  head() {
    const title = `影音 - ${SITE_NAME}`
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getDomain()}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    categoriesFiltered() {
      return this.allCategories?.filter(
        (category) => this[`${category.slug}Posts`]?.items?.length > 0
      )
    },
    categoriesSlug() {
      return this.allCategories?.map((category) => category.slug)
    },
  },
  mounted() {
    if (this.categoriesSlug?.length > 0) {
      this.fetchPostsByCategory()
    }
  },
  methods: {
    fetchPostsByCategory() {
      this.categoriesSlug.forEach((slug) => {
        this.$apollo.addSmartQuery(`${slug}Posts`, {
          query: fetchPostsByCategorySlug,
          variables: () => ({
            category: slug,
            style: 'videoNews',
            withCount: true,
          }),
          update: (rawData) => {
            const data = {
              items: rawData.allPosts || [],
              total: rawData._allPostsMeta?.count ?? 0,
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
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('videonews')('click')(label)
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
}

.g-aside {
  margin: 20px 0 0;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 0 0 0 39px;
    margin: 49px 0 0;
    border-left: 1px solid #d8d8d8;
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
