<template>
  <ol class="host-list">
    <li v-for="host in hosts" :key="host.name">
      <a
        :href="host.href"
        target="_blank"
        rel="noreferrer noopener"
        class="host-list__item"
      >
        <img v-lazy="host.image" :alt="host.name" />
        <div class="host-list__item__content">
          <h3>主持人｜{{ host.name }}</h3>
          <!-- eslint-disable vue/no-v-html -->
          <p v-if="host.bio[0]" v-html="host.bio[0].content" />
        </div>
      </a>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    hosts: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.host-list {
  &__item {
    display: flex;
    position: relative;
    margin-bottom: 24px;
    padding: 6px 0 6px 24px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 10px;
      background: linear-gradient(
        to bottom,
        #d8eaeb 25%,
        #fff 25%,
        #fff 50%,
        #e7e7e7 50%,
        #e7e7e7 75%,
        #c1c2c2 75%
      );
    }
    img {
      min-width: 70px;
      max-width: 70px;
      min-height: 70px;
      max-height: 70px;
      object-fit: cover;
      object-position: center;
      @include default-background-image;
      @include media-breakpoint-up(md) {
        min-width: 80px;
        max-width: 80px;
        min-height: 80px;
        max-height: 80px;
      }
    }
    &__content {
      margin-left: 10px;
      h3 {
        font-size: 20px;
        line-height: 22px;
        margin-bottom: 8px;
        @include media-breakpoint-up(md) {
          margin-bottom: 12px;
        }
      }
      p {
        font-size: 16px;
        line-height: 26px;
        text-align: left;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
    &:hover h3 {
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  }
}
</style>
