<template>
  <div class="annotation">
    <span @click="openAnnotation = !openAnnotation" v-text="annotation.text" />
    <div v-show="openAnnotation" class="annotation__content">
      <div class="content" v-html="annotation.pureAnnotationText" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    annotation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      openAnnotation: false
    }
  }
}
</script>

<style lang="scss" scoped>
.annotation {
  display: inline;
  span {
    color: #014db8;
    cursor: pointer;
  }
  &__content {
    padding: 10px;
    background-color: #e7e7e7;
  }
}
</style>
