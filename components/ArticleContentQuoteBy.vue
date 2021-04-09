<template>
  <div class="quote-by">
    <div class="quote-by__content">{{ quoteContent }}</div>
    <div class="quote-by__by">—— {{ quoteBy }}</div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      openAnnotation: false,
    }
  },
  computed: {
    quoteContent() {
      return this.content.quote
    },
    quoteBy() {
      return this.content.quoteBy
    },
  },
}
</script>

<style lang="scss" scoped>
.quote-by {
  position: relative;
  padding: 17px;
  margin: 0 26px;

  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 54px;
    height: 60px;
    border-top: 4px solid #1eb5ea;
    border-left: 4px solid #1eb5ea;
  }
  &::before {
    top: -4px;
    left: -4px;
  }
  &::after {
    right: -4px;
    bottom: -4px;
    transform: rotate(180deg);
  }

  &__content {
    font-size: 16px;
    line-height: 180%;
    text-align: justify;
  }

  &__by {
    position: absolute;
    right: 62px;
    bottom: -12.5px;
    font-size: 14px;
    line-height: 25px;
    color: #1eb5ea;
  }
}
</style>
