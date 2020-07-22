<template>
  <div class="list-wrapper">
    <H1Bordered class="list-wrapper__list-title list-title" :text="listTitle" />
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
import H1Bordered from './H1Bordered.vue'
import ArticleCardAside from './ArticleCardAside.vue'

export default {
  components: {
    H1Bordered,
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
