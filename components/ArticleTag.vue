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
  color: $color-blue;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.87;
  span {
    display: inline-block;
    padding: 1px 9px;
    border: 1px solid $color-blue;
    &::before {
      content: '#';
      margin-right: 1px;
    }
    &:hover {
      background-color: rgba(0, 77, 188, 0.05);
    }
    &:active {
      background-color: rgba(0, 77, 188, 0.15);
    }
  }
}
</style>
