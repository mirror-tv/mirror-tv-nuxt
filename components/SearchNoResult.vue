<template>
  <div class="no-result">
    <SearchNoResultIcon :keyword="keyword" />
  </div>
</template>

<script>
import SearchNoResultIcon from '~/components/SearchNoResultIcon.vue'

export default {
  components: {
    SearchNoResultIcon,
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
}
</script>

<style lang="scss" scoped>
.no-result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
