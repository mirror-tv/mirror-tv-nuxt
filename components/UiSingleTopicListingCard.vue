<template>
  <a :href="href" target="_blank" rel="noreferrer noopener">
    <picture>
      <img v-lazy="image" :src="'/image-default.jpg'" :alt="title" />
    </picture>
    <h4>{{ title }}</h4>
    <span v-show="categoryName" class="category-tag">
      {{ categoryName }}
    </span>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: require('~/assets/img/default/image-default.jpg'),
    },
    categoryName: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #d8d8d8;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 12px;
  picture {
    display: block;
    position: relative;
    width: 100%;
    padding-top: 66.66%;
    margin: 0 0 12px;
    background-color: $color-grey;
    overflow: hidden;
    @include media-breakpoint-up(md) {
      margin: 0 0 9px;
    }
    @include media-breakpoint-up(xl) {
      margin: 0 0 12px;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  h4 {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    text-align: justify;
    color: #4a4a4a;
    word-wrap: break-word;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    @include media-breakpoint-up(xl) {
      font-size: 16px;
    }
  }
  .category-tag {
    display: block;
    position: absolute;
    top: 12px;
    left: 12px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 1px;
    color: #036;
    background-color: #f4f5f7;
    padding: 2px 12px;
  }
}
</style>
