<template>
  <a
    :href="`/tag/${tagName}`"
    class="tag"
    target="_blank"
    rel="noreferrer noopener"
  >
    <span v-text="tagName" />
  </a>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      required: true,
    },
  },
  computed: {
    tagName() {
      return this.tag.name
    },
  },
}
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  padding: 1px 9px;
  color: #014db8;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.87;
  border: 1px solid #014db8;
  span {
    display: inline-block;
    &::before {
      content: '#';
      margin-right: 1px;
    }
  }
}
</style>
