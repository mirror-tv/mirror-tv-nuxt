<template>
  <a :href="href" target="_blank" rel="noreferrer noopener">
    <div class="content">
      <picture>
        <img :src="image" :alt="title" />
      </picture>
      <h4>{{ title }}</h4>
    </div>
    <div v-if="shouldShowBrief" class="mask">
      <div class="mask__content">
        <!-- eslint-disable vue/no-v-html -->
        <p v-html="formatedBrief" />
      </div>
    </div>
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
    brief: {
      type: Array,
      default: () => [],
    },
    image: {
      type: String,
      default: require('~/assets/img/default/image-default.jpg'),
    },
  },
  computed: {
    formatedBrief() {
      const str = this.brief?.map((item) => item?.content?.[0] || '')
      return str.join('<br>')
    },
    shouldShowBrief() {
      return this.formatedBrief?.length > 0
    },
  },
}
</script>

<style lang="scss" scoped>
a {
  display: block;
  position: relative;
  background: #f4f5f7;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  padding: 11px;
  .content {
    picture {
      display: block;
      position: relative;
      width: 100%;
      padding-top: 66.66%;
      margin: 0 0 11px;
      background-color: $color-grey;
      overflow: hidden;
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
      font-size: 20px;
      font-weight: 500;
      line-height: 1.6;
      letter-spacing: 0.5px;
      color: #4a4a4a;
      word-wrap: break-word;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  .mask {
    position: absolute;
    display: none;
    align-items: center;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(29, 29, 29, 0.75);
    padding: 12px;
    @include media-breakpoint-up(md) {
      padding: 24px;
    }
    &__content {
      p {
        width: 100%;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.8;
        text-align: justify;
        color: #fff;
        word-wrap: break-word;
        -webkit-line-clamp: 6;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        @include media-breakpoint-up(md) {
          font-size: 14px;
          font-weight: normal;
          line-height: 1.6;
        }
        @include media-breakpoint-up(xl) {
          font-size: 16px;
          line-height: 1.8;
        }
      }
    }
  }
  &:hover {
    .mask {
      display: flex;
    }
  }
}
</style>
