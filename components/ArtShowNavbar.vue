<template>
  <ol class="pages">
    <li
      v-for="page in pages"
      :key="page.page"
      :class="{ 'pages__item-active': currentPage === page.page }"
      class="pages__item"
    >
      <a :href="`/show/${currentSlug}/${page.page}`" rel="noreferer noopener">
        {{ page.name }}
      </a>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    currentSlug: {
      type: String,
      required: true,
    },
    currentPage: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      pages: [
        { page: 'about', name: '關於節目' },
        { page: 'series', name: '單元系列' },
        { page: 'weekly', name: '每週藝文' },
        { page: 'indepth', name: '深度專題' },
        { page: 'international', name: '國際藝文' },
        { page: 'team', name: '創作團隊' },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.pages {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 32px);
  transform: translateX(-16px);
  text-align: center;
  background-color: $color-blue;
  padding: 10px 42px 5px;
  @include media-breakpoint-up(md) {
    flex-wrap: no-wrap;
    width: 100%;
    transform: none;
    background-color: #fff;
    padding: 0;
  }
  @include media-breakpoint-up(xl) {
    margin-bottom: 34px;
  }
  &__item {
    display: flex;
    justify-content: cneter;
    align-items: center;
    width: 33.3333333%;
    color: #fff;
    font-size: 14px;
    line-height: 28px;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
    @mixin separator_line() {
      content: '';
      display: inline-block;
      width: 2px;
      height: 16px;
      background-color: #fff;
    }
    &::before {
      @include separator_line;
    }
    &:nth-child(3) {
      &::after {
        @include separator_line;
      }
    }
    &:last-child {
      &::after {
        @include separator_line;
      }
    }
    &-active {
      color: #ffdb49;
    }
    @include media-breakpoint-up(md) {
      width: calc((100% - 25px * 5) / 6);
      color: $color-blue;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      margin: 0 25px 0 0;
      padding: 4px 0;
      border: 3px solid $color-blue;
      &::before {
        display: none;
      }
      &:nth-child(3) {
        &::after {
          display: none;
        }
      }
      &:last-child {
        margin: 0;
        &::after {
          display: none;
        }
      }
      &-active {
        color: #fff;
        background-color: $color-blue;
      }
    }
    @include media-breakpoint-up(xl) {
      width: calc((100% - 36px * 5) / 6);
      font-size: 20px;
      margin: 0 36px 0 0;
      padding: 8px 0;
      &:hover {
        color: #fff;
        background-color: $color-blue;
      }
    }
    a {
      display: block;
      width: 100%;
    }
  }
}
</style>
