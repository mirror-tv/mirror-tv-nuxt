<template>
  <div class="list-wrapper">
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
    ArticleCardAside
  },
  props: {
    listTitle: {
      type: String,
      required: true
    },
    listData: {
      type: Array,
      required: true
    },
    moreTo: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(xl) {
    border: 1px solid #979797;
    padding: 31px;
  }
  &__list {
    margin: 20px 0 0 0;
  }
  &__more-link {
    margin: 10px 0 0 0;
    align-self: flex-end;
  }
}

.list-title {
  width: max-content;
}

.list {
  &__list-item {
    & + & {
      margin: 20px 0 0 0;
    }
  }
}

.more-link {
  color: #014db8;
  font-size: 20px;
  letter-spacing: 0.5px;
  text-decoration: underline;
}
</style>
