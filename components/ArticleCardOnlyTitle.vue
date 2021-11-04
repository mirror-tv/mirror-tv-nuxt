<template>
  <a
    :href="href"
    class="article-card"
    target="_blank"
    rel="noopener noreferrer"
    v-text="articleTitle"
  />
</template>

<script>
export default {
  props: {
    articleTitle: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.article-card {
  color: #4a4a4a;
  font-size: 16px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  &:hover {
    border-bottom: 1px solid #000;
  }
}
</style>
