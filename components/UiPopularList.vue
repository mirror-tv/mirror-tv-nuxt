<template>
  <div class="popular-list">
    <HeadingBordered class="heading" :text="title" />
    <ol>
      <li v-for="item in listPopularData" :key="item.title">
        <a :href="item.href" target="_blank" rel="noreferrer noopener">
          {{ item.title }}
        </a>
      </li>
    </ol>
  </div>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'

export default {
  components: {
    HeadingBordered,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    listPopularData: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.popular-list {
  .heading {
    margin: 0 0 20px;
    min-width: 110px;
  }
  ol {
    display: block;
    width: 100%;
    li {
      position: relative;
      padding: 16px 0 16px 28px;
      border-bottom: 1px solid #f4f5f7;
      &::before {
        content: '';
        position: absolute;
        top: 24px;
        left: 8px;
        border: 4px solid #f4f5f6;
        border-radius: 50%;
      }
      @include media-breakpoint-up(md) {
        padding: 12px 0 12px 28px;
        &::before {
          top: 20px;
        }
      }
      a {
        font-size: 16px;
        line-height: 22px;
        &:hover {
          border-bottom: 1px solid #000;
        }
      }
    }
  }
}
</style>
