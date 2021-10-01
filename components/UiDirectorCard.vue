<template>
  <a
    class="director__card"
    :href="href"
    target="_blank"
    rel="noreferrer noopener"
    @click="handleClickDirectorCard"
  >
    <div class="director__card__cover">
      <img v-lazy="image" class="director-img" alt="article-img" />
      <div class="director-name">{{ name }}</div>
    </div>
    <div class="director__card__intro">
      <!-- eslint-disable vue/no-v-html -->
      <p v-html="bio" />
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
    image: {
      type: String,
      default: require('~/assets/img/default/image-default.jpg'),
    },
    name: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleClickDirectorCard() {
      this.$emit('click-director-card')
    },
  },
}
</script>

<style lang="scss" scoped>
.director__card {
  display: block;
  width: 100%;
  @include media-breakpoint-up(md) {
    display: flex;
  }
  @include media-breakpoint-up(xl) {
    display: block;
  }
  &__cover {
    min-width: 120px;
    max-width: 120px;
    @include media-breakpoint-up(md) {
      min-width: 200px;
      max-width: 200px;
      margin: 0 44px 0 0;
    }
    .director-img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      object-position: center;
      @include media-breakpoint-up(md) {
        height: 200px;
      }
    }
    .director-name {
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      color: #fff;
      text-align: center;
      background-color: #121e7c;
      padding: 6px 20px;
    }
  }
  &__intro {
    margin: 18px 0 0;
    @include media-breakpoint-up(md) {
      margin: 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 28px 0 0;
    }
    p {
      font-size: 16px;
      line-height: 1.8;
      word-wrap: break-word;
      word-break: break-all;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      @include media-breakpoint-up(xl) {
        -webkit-line-clamp: 4;
      }
    }
  }
}
</style>
