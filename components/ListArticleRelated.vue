<template>
  <div v-if="hasItems" class="list-wrapper">
    <HeadingBordered text="相關文章" />
    <ul class="list-wrapper__list list">
      <li
        v-for="item in listData"
        :key="`list-article-related-${item.slug}`"
        class="list__list-item"
      >
        <ArticleCardOnlyTitle
          :articleTitle="item.title"
          :href="`/story/${item.slug}`"
          @click.native="$emit('click-item')"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import ArticleCardOnlyTitle from './ArticleCardOnlyTitle.vue'
import HeadingBordered from './HeadingBordered.vue'

export default {
  components: {
    ArticleCardOnlyTitle,
    HeadingBordered,
  },
  props: {
    listData: {
      type: Array,
      required: true,
    },
  },
  computed: {
    hasItems() {
      return this.listData?.length > 0
    },
  },
}
</script>

<style lang="scss" scoped>
.list-wrapper {
  &__list {
    margin-top: 12px;
  }
}

.list {
  &__list-item {
    position: relative;
    padding: 8px 0 8px 20px;
    border-bottom: 1px solid #d8d8d8;
    &::before {
      content: '';
      position: absolute;
      top: 18px;
      left: 0;
      display: inline-block;
      width: 7px;
      height: 7px;
      background-color: #d8d8d8;
      border-radius: 50%;
    }
  }
}
</style>
