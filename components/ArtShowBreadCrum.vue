<template>
  <ol v-if="Object.keys(section).length" class="breadcrum">
    <li class="breadcrum__item">
      <a
        :href="`/show/art/${section.slug}`"
        rel="noreferer noopener"
        class="breadcrum__item__section"
      >
        {{ section.name }}
      </a>
    </li>
    <li v-if="series" class="breadcrum__item">
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
      <a
        :href="`/show/art/${section.slug}/${series.slug}`"
        rel="noreferer noopener"
        class="breadcrum__item__section"
      >
        {{ series.name }}
      </a>
    </li>
    <li v-if="Object.keys(artShow).length" class="breadcrum__item">
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
      <a :href="`/`" rel="noreferer noopener" class="breadcrum__item__section">
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
    margin: 20px 0;
    letter-spacing: 0.5px;
  }
  @include media-breakpoint-up(xl) {
    margin: 40px 0;
  }
  &__item {
    display: flex;
    align-items: center;
    &-img {
      width: 12px;
      height: 12px;
      margin: 0 5px;
      @include media-breakpoint-up(md) {
        width: 20px;
        height: 20px;
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
