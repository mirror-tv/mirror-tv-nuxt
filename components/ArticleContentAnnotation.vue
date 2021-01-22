<template>
  <div class="annotation">
    <span v-text="annotation.text" />
    <button
      :class="{ active: openAnnotation }"
      @click="openAnnotation = !openAnnotation"
    >
      （註）
    </button>
    <div v-show="openAnnotation" class="annotation__content">
      <!-- eslint-disable vue/no-v-html -->
      <div class="content" v-html="annotation.pureAnnotationText" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    annotation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openAnnotation: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.annotation {
  display: inline;
  button {
    color: $color-blue;
    &::after {
      content: '';
      position: relative;
      top: 1px;
      display: inline-block;
      width: 14px;
      height: 14px;
      background-image: url('~assets/img/annotation.svg');
      background-size: 14px 14px;
      transition: transform 0.7s ease;
    }
    &.active {
      &::after {
        transform: rotate(180deg);
      }
    }
  }
  &__content {
    padding: 16px 10px;
    margin: 20px 0;
    color: #4a4a4a;
    font-size: 14px;
    background-color: #fff;
    border-top: 3px solid $color-blue;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  }
}
</style>
