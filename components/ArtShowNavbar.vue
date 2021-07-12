<template>
  <ol class="pages">
    <li
      :key="pages[0].slug"
      :class="{ 'pages__item-active': currentPage === pages[0].slug }"
      class="pages__item"
    >
      <a
        :href="`/show/${currentSlug}/${pages[0].slug}`"
        rel="noreferer noopener"
        @click="handleClickPageLink(pages[0].name)"
      >
        {{ pages[0].name }}
      </a>
    </li>
    <li
      v-for="page in sectionList"
      :key="page.slug"
      :class="{ 'pages__item-active': currentPage === page.slug }"
      class="pages__item"
    >
      <a
        :href="`/show/${currentSlug}/${page.slug}`"
        rel="noreferer noopener"
        @click="handleClickPageLink(page.name)"
      >
        {{ page.name }}
      </a>
    </li>
    <li
      :key="pages[1].slug"
      :class="{ 'pages__item-active': currentPage === pages[1].slug }"
      class="pages__item"
    >
      <a
        :href="`/show/${currentSlug}/${pages[1].slug}`"
        rel="noreferer noopener"
        @click="handleClickPageLink(pages[1].name)"
      >
        {{ pages[1].name }}
      </a>
    </li>
  </ol>
</template>

<script>
import { sendGaEvent } from '~/utils/google-analytics'

export default {
  props: {
    gaCategory: {
      type: String,
      default: 'ArtShow',
    },
    currentSlug: {
      type: String,
      required: true,
    },
    currentPage: {
      type: String,
      required: true,
    },
    sectionList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      pages: [
        { slug: 'about', name: '關於節目' },
        { slug: 'team', name: '創作團隊' },
      ],
    }
  },
  methods: {
    handleClickPageLink(name) {
      sendGaEvent(this.$ga)(this.gaCategory)('click')(`索引：${name}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.pages {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: calc(100% + 32px);
  transform: translateX(-16px);
  text-align: center;
  background-color: $color-blue;
  padding: 16px 26px;
  row-gap: 12px;
  @include media-breakpoint-up(md) {
    flex-wrap: no-wrap;
    width: 100%;
    transform: none;
    padding: 20px 33px;
  }
  @include media-breakpoint-up(xl) {
    padding: 24px;
  }
  &__item {
    display: flex;
    justify-content: cneter;
    align-items: center;
    width: 33.3333333%;
    color: #fff;
    font-size: 18px;
    line-height: 25px;
    font-weight: 500;
    @mixin separator_line() {
      content: '';
      display: inline-block;
      width: 2px;
      height: 16px;
      background-color: rgba(255, 255, 255, 0.5);
      @include media-breakpoint-up(md) {
        height: 24px;
      }
    }
    &:not(:nth-child(3n + 1)) {
      &::before {
        @include separator_line;
      }
    }
    &-active {
      color: #ffdb49;
    }
    @include media-breakpoint-up(md) {
      width: auto;
      font-size: 20px;
      line-height: 160%;
      letter-spacing: 0.5px;
      &:not(:nth-child(1)) {
        &::before {
          margin: 0 12px;
        }
      }
      &:nth-child(4) {
        &::before {
          @include separator_line;
        }
      }
      &-active {
        background-color: $color-blue;
      }
    }
    @include media-breakpoint-up(xl) {
      font-size: 20px;
      &:hover {
        color: #fff;
        background-color: $color-blue;
      }
      &:not(:nth-child(1)) {
        &::before {
          margin: 0 16px;
        }
      }
    }
    a {
      display: block;
      width: 100%;
    }
  }
}
</style>
