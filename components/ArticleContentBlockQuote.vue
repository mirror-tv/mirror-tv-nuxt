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
  font-size: 16px;
  line-height: 180%;
  text-align: justify;
  color: #014db8;
  &::before,
  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    width: 30px;
    height: 30px;
    background-image: url('~assets/img/quote.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
  }
  &::before {
    top: 5px;
    left: 0;
  }
  &::after {
    bottom: 19px;
    right: 0;
    transform: rotate(180deg);
  }
}
</style>
