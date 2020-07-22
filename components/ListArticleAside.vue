<template>
  <div class="list-wrapper">
    <h1 class="list-wrapper__list-title list-title" v-text="listTitle" />
    <ol>
      <li v-for="(item, i) in listData" :key="`list-article-aside-${i}`">
        <ArticleCardAside
          :href="item.href"
          :articleImgURL="item.articleImgURL"
          :articleTitle="item.articleTitle"
        />
      </li>
    </ol>
    <nuxt-link v-if="!!moreTo" :to="moreTo" />
  </div>
</template>

<script>
import ArticleCardAside from './ArticleCardAside.vue'

export default {
  components: {
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
      type: String
    }
  }
}
</script>

<style scoped></style>
