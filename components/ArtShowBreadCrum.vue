<template>
  <ol v-if="hasSection || hasSeries || hasArtShow" class="breadcrum">
    <li v-if="hasSection" class="breadcrum__item">
      <a
        :href="`/show/${currentShow}/${section.slug}`"
        rel="noreferer noopener"
      >
        {{ section.name }}
      </a>
      <div class="breadcrum__item-img">
        <img src="~assets/img/icon/arrow-blue-dark.svg" alt="right arrow" />
      </div>
    </li>
    <li v-if="hasSeries" class="breadcrum__item">
      <a
        v-if="hasArtShow"
        :href="`/show/${currentShow}/${section.slug}/${series.slug}`"
        rel="noreferer noopener"
      >
        {{ series.name }}
      </a>
      <span v-else>{{ series.name }}</span>
      <div v-if="hasArtShow" class="breadcrum__item-img">
        <img src="~assets/img/icon/arrow-blue-dark.svg" alt="right arrow" />
      </div>
    </li>
    <li v-if="hasArtShow" class="breadcrum__item">
      <span>{{ artShow.name }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
      default: () => {},
      required: true,
    },
    series: {
      type: Object,
      default: () => {},
    },
    artShow: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    currentShow() {
      return this.$route.params.slug ?? ''
    },
    hasSection() {
      return this.hasContent(this.section)
    },
    hasSeries() {
      return this.hasContent(this.series)
    },
    hasArtShow() {
      return this.hasContent(this.artShow)
    },
  },
  methods: {
    hasContent(item) {
      return item && item.name && item.slug
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrum {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  color: #036;
  margin: 15px 0;
  @include media-breakpoint-up(md) {
    font-size: 20px;
    line-height: 160%;
    margin: 20px 0 0;
    letter-spacing: 0.5px;
  }
  @include media-breakpoint-up(xl) {
    margin: 40px 0 0;
  }
  &__item {
    display: flex;
    align-items: center;
    &-img {
      width: 10px;
      height: 10px;
      margin: 0 5px;
      @include media-breakpoint-up(md) {
        width: 14px;
        height: 14px;
        margin: 0 12px;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    a {
      display: block;
      margin: 0 0 2px;
      border-bottom: 2px solid #036;
      &:hover,
      &:focus,
      &:active {
        color: $color-blue;
        border-bottom: 2px solid $color-blue;
      }
    }
    span {
      margin: 0 0 2px;
    }
  }
}
</style>
