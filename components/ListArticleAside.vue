<template>
  <div
    v-if="hasListData"
    class="list-wrapper"
    :class="{ 'xl-border': hasBorderInXl }"
  >
    <HeadingBordered
      class="list-wrapper__list-title list-title"
      :text="listTitle"
    />
    <ol class="list-wrapper__list list">
      <li
        v-for="(item, i) in listData"
        :key="`list-article-aside-${i}`"
        class="list__list-item"
      >
        <ArticleCardAside
          :href="item.href"
          :articleImgURL="item.articleImgURL"
          :articleTitle="item.articleTitle"
        />
      </li>
    </ol>
    <nuxt-link
      v-if="!!moreTo"
      class="list-wrapper__more-link more-link"
      :to="moreTo"
      v-text="'more'"
    />
  </div>
</template>

<script>
import HeadingBordered from './HeadingBordered.vue'
import ArticleCardAside from './ArticleCardAside.vue'

export default {
  components: {
    HeadingBordered,
    ArticleCardAside,
  },
  props: {
    listTitle: {
      type: String,
      required: true,
    },
    listData: {
      type: Array,
      required: true,
    },
    moreTo: {
      type: String,
      default: '',
    },
    hasBorderInXl: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasListData() {
      return this.listData?.length
    },
  },
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  margin: 40px 0 40px;

  // tablet range
  @include media-breakpoint-up(md) {
    border: 1px solid $color-grey-deep;
    padding: 24px;
    margin: 48px 0 40px;
  }

  // desktop range
  @include media-breakpoint-up(xl) {
    border: none;
    padding: 32px;
    margin: 0 0 40px;
  }
  &__list {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 20px 0 0 0;
    }
  }
  &__more-link {
    margin: 10px 0 0 0;
    align-self: flex-end;
  }
}

.xl-border {
  @include media-breakpoint-up(xl) {
    border: 1px solid $color-grey-deep;
  }
}

.list-title {
  width: max-content;
}

.list {
  &__list-item {
    & + & {
      margin: 16px 0 0 0;
      @include media-breakpoint-up(xl) {
        margin: 20px 0 0 0;
      }
    }
  }
}

.more-link {
  color: $color-blue;
  font-size: 20px;
  letter-spacing: 0.5px;
  text-decoration: underline;
}
</style>
