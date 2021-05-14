<template>
  <div class="no-result">
    <SearchNoResultIcon :keyword="keyword" class="no-result__icon" />
    <template v-if="hasListData">
      <HeadingBordered class="popular-article__title" :text="'熱門新聞'" />
      <ol class="popular-article__list">
        <li
          v-for="post in listArticlePopularData"
          :key="post.id"
          class="popular-article__list__item"
        >
          <ArticleCard
            :href="post.href"
            :articleImgURL="post.articleImgURL"
            :articleTitle="post.articleTitle"
            :articleTitleStyle="'bold'"
            :articleDate="post.articleDate"
            :mobileLayoutDirection="'column'"
          />
        </li>
        <div class="position-correct" />
      </ol>
    </template>
  </div>
</template>

<script>
import SearchNoResultIcon from '~/components/SearchNoResultIcon.vue'
import HeadingBordered from '~/components/HeadingBordered'
import ArticleCard from '~/components/ArticleCard'
import { getImageUrl } from '~/utils/post-image-handler'

export default {
  components: {
    SearchNoResultIcon,
    HeadingBordered,
    ArticleCard,
  },
  props: {
    keyword: {
      type: String,
      isRequired: true,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      popularData: {},
      isDesktop: false,
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchPopularListData()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  },
  computed: {
    listArticlePopularData() {
      const listData = this.popularData?.report ?? []
      const num = this.isDesktop ? 4 : 3
      return listData
        .filter((report, i) => i < num)
        .map((report) => this.reducerArticleCard(report))
    },
    hasListData() {
      return this.listArticlePopularData.length
    },
  },
  mounted() {
    this.detectViewport()
  },
  methods: {
    reducerArticleCard(post) {
      return {
        href: `/story/${post.slug}`,
        articleImgURL: getImageUrl(post),
        articleTitle: post.name,
        articleDate: new Date(post.publishTime),
      }
    },
    detectViewport() {
      const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (viewportWidth >= 1200) {
        this.isDesktop = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.no-result {
  width: 100%;
  &__icon {
    margin: 0 auto 36px;
    @include media-breakpoint-up(md) {
      margin: 0 auto 80px;
    }
  }
}
.popular-article {
  &__title {
    position: relative;
    margin-bottom: 52px;
    &::after {
      content: '';
      position: absolute;
      bottom: -28px;
      left: -3px;
      width: calc(100vw - 32px);
      height: 4px;
      background-color: $color-blue;
      @include media-breakpoint-up(sm) {
        max-width: 600px;
      }
      @include media-breakpoint-up(md) {
        max-width: none;
        width: 688px;
      }
      @include media-breakpoint-up(xl) {
        width: 1118px;
      }
      @include media-breakpoint-up(xxl) {
        width: 1200px;
      }
    }
  }
  &__list {
    @include media-breakpoint-up(md) {
      width: 100%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      &::after {
        content: '';
        width: calc((100% - 40px) / 3);
      }
      .position-correct {
        width: calc((100% - 40px) / 3);
        overflow: hidden;
      }
    }
    @include media-breakpoint-up(xl) {
      &::after {
        content: '';
        width: calc((100% - 96px) / 4);
      }
      .position-correct {
        width: calc((100% - 96px) / 4);
        overflow: hidden;
      }
    }
    @include media-breakpoint-up(xxl) {
      &::after {
        content: '';
        width: calc((100% - 48px) / 4);
      }
      .position-correct {
        width: calc((100% - 48px) / 4);
        overflow: hidden;
      }
    }
    &__item {
      margin-bottom: 24px;
      @include media-breakpoint-up(md) {
        width: calc((100% - 40px) / 3);
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
      }
      @include media-breakpoint-up(xxl) {
        width: calc((100% - 48px) / 4);
      }
    }
  }
}
</style>
