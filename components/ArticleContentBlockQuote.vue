<template>
  <div class="blockquote">{{ blockquote }}</div>
</template>

<script>
export default {
  props: {
    blockquote: {
      type: String,
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
.blockquote {
  position: relative;
  padding: 0 55px;
  line-height: 1.75;
  text-align: justify;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    top: 0;
    width: 30px;
    height: 30px;
    background-image: url('~assets/img/quote.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
    transform: rotate(180deg);
  }
}
</style>
