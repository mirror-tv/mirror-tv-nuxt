<template>
  <ol v-if="hasSection" class="breadcrum">
    <li class="breadcrum__item">
      <a
        :href="`/show/${currentShow}/${section.slug}`"
        rel="noreferer noopener"
        class="breadcrum__item__section"
      >
        {{ section.name }}
      </a>
    </li>
    <li v-if="hasSeries" class="breadcrum__item">
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
      <a
        :href="`/show/${currentShow}/${section.slug}/${series.slug}`"
        rel="noreferer noopener"
        class="breadcrum__item__section"
      >
        {{ series.name }}
      </a>
    </li>
    <li v-if="hasArtShow" class="breadcrum__item">
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
      <a
        :href="`/show/${currentShow}`"
        rel="noreferer noopener"
        class="breadcrum__item__section"
      >
        {{ artShow.name }}
      </a>
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
      return this.section && Object.keys(this.section).length
    },
    hasSeries() {
      return this.series && Object.keys(this.series).length
    },
    hasArtShow() {
      return this.artShow && Object.keys(this.artShow).length
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
  color: $color-blue;
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
  }
}
</style>
