<template>
  <ol class="breadcrum">
    <li class="breadcrum__item">
      <a :href="`/`" rel="noreferer noopener" class="breadcrum__item__section">
        {{ section }}
      </a>
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
    </li>
    <li class="breadcrum__item">
      <a :href="`/`" rel="noreferer noopener" class="breadcrum__item__section">
        {{ series }}
      </a>
      <div class="breadcrum__item-img">
        <img src="~assets/img/art-show-arrow.svg" alt="right arrow" />
      </div>
    </li>
    <li class="breadcrum__item">
      <a :href="`/`" rel="noreferer noopener" class="breadcrum__item__section">
        {{ showName }}
      </a>
    </li>
  </ol>
</template>

<script>
export default {
  data() {
    return {
      section: '單元系列',
      series: '單元一二三',
      showName: '影片第一集',
    }
  },
}
</script>

<style lang="scss" scoped>
.breadcrum {
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: $color-blue;
  margin: 12px 0;
  @include media-breakpoint-up(md) {
    font-size: 30px;
    line-height: 42px;
    margin: 28px 0;
  }
  @include media-breakpoint-up(xl) {
    margin-bottom: 40px;
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
