<template>
  <ol class="list-handler">
    <li v-for="post in posts" :key="post.slug" class="list-handler__item">
      <ArticleCard
        :href="post.href"
        :articleImgURL="post.image"
        :articleTitle="post.name"
        :articleDate="post.publishTime"
        mobileLayoutDirection="column"
        @click.native="handleClickItem"
      />
    </li>
    <div class="position-correct" />
  </ol>
</template>

<script>
import ArticleCard from '~/components/ArticleCard'

export default {
  components: {
    ArticleCard,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleClickItem() {
      this.$emit('click-item')
    },
  },
}
</script>

<style lang="scss" scoped>
.list-handler {
  @include media-breakpoint-up(md) {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &::after {
      content: '';
      width: calc((100% - 40px) / 3);
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
    margin-bottom: 28px;
    @include media-breakpoint-up(md) {
      margin-bottom: 48px;
      width: calc((100% - 40px) / 3);
    }
    @include media-breakpoint-up(xl) {
      margin-bottom: 40px;
      width: calc((100% - 96px) / 4);
    }
    @include media-breakpoint-up(xxl) {
      width: calc((100% - 48px) / 4);
    }
  }
}
</style>
