<template>
  <ol class="pages">
    <li
      v-for="page in formatSectionList"
      :key="page.slug"
      :class="{ 'pages__item-active': currentSection === page.slug }"
      class="pages__item"
    >
      <a
        :href="`/show/${currentShow}/${page.slug}`"
        rel="noreferer noopener"
        @click="handleClickPageLink(page.name)"
      >
        {{ page.name }}
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
      default: '',
    },
    currentShow: {
      type: String,
      required: true,
      default: '',
    },
    currentSection: {
      type: String,
      required: true,
      default: '',
    },
    sectionList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formatSectionList() {
      const aboutPage = { slug: 'main', name: '關於節目' }
      const teamPage = { slug: 'team', name: '創作團隊' }
      return [aboutPage, teamPage, ...this.sectionList]
    },
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
    justify-content: end;
    align-items: center;
    position: relative;
    width: 50%;
    color: #fff;
    font-size: 18px;
    line-height: 26px;
    font-weight: 500;
    @mixin separator_line() {
      content: '';
      display: inline-block;
      position: absolute;
      top: calc((26px - 16px) / 2);
      left: 0;
      width: 2px;
      height: 16px;
      background-color: rgba(255, 255, 255, 0.5);
      @include media-breakpoint-up(md) {
        position: static;
        top: 0;
        left: 0;
        height: 24px;
      }
    }
    &:nth-child(odd) {
      text-align: right;
      padding: 0 12px 0 0;
      @include media-breakpoint-up(md) {
        text-align: center;
        padding: 0;
      }
    }
    &:nth-child(even) {
      text-align: left;
      padding: 0 0 0 12px;
      @include media-breakpoint-up(md) {
        text-align: center;
        padding: 0;
      }
      &::before {
        @include separator_line;
      }
    }
    &:not(:nth-child(3n + 1)) {
      @include media-breakpoint-up(md) {
        &::before {
          @include separator_line;
        }
      }
    }
    &:last-child:nth-child(odd) {
      text-align: center;
      padding: 0;
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
      &:nth-child(3n + 4) {
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
      &:hover,
      &:active,
      &:focus {
        color: #ffdb49;
      }
    }
  }
}
</style>
