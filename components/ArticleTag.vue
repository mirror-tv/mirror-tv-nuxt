<template>
  <a class="tag">
    <span v-text="tag.name" />
  </a>
</template>

<script>
export default {
  props: {
    tag: {
      type: Object,
      required: true
    }
  }
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
