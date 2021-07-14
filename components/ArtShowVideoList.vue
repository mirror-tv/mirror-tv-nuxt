<template>
  <div class="artShow_list_wrapper">
    <ol>
      <li v-for="item in showList" :key="item.id">
        <a
          :href="`/show/${currentSlug}/video/${item.id}`"
          rel="noreferer noopener"
          @click="$emit('click-video')"
        >
          <img
            v-if="item.heroVideo && item.heroVideo.coverPhoto"
            :src="item.heroVideo.coverPhoto.urlOriginal"
            :alt="item.name"
          />
          <img v-else src="~assets/img/image-default.png" :alt="item.name" />
        </a>
        <h4 v-text="item.name" />
      </li>
      <div class="position-correct" />
    </ol>
    <ButtonLoadmore
      v-show="showLoadMoreButton"
      class="g-button-load-more"
      @click.native="$emit('click-more-button')"
    />
  </div>
</template>

<script>
import ButtonLoadmore from '~/components/ButtonLoadmore'

export default {
  components: {
    ButtonLoadmore,
  },
  props: {
    showList: {
      type: Array,
      default: () => [],
      required: true,
    },
    currentSlug: {
      type: String,
      required: true,
    },
    handleClickMore: {
      type: Function,
      default: () => {},
    },
    showLoadMoreButton: {
      type: Boolean,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.artShow_list_wrapper {
  flex: 1;
}
h3 {
  color: $color-blue;
  font-size: 18px;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  @include media-breakpoint-up(md) {
    margin-bottom: 20px;
    font-size: 20px;
    line-height: 160%;
  }
}
ol {
  @include media-breakpoint-up(md) {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &::after {
      content: '';
      width: calc((100% - 52px) / 2);
    }
  }
  @include media-breakpoint-up(xl) {
    &::after {
      content: '';
      width: calc((100% - 96px) / 4);
    }
    .position-correct {
      width: calc((100% - 96px) / 4);
      overflow: hidden;
    }
  }
  @include media-breakpoint-up(xxl) {
    &::after {
      content: '';
      width: calc((100% - 48px) / 4);
    }
    .position-correct {
      width: calc((100% - 48px) / 4);
      overflow: hidden;
    }
  }
  li {
    margin-bottom: 20px;
    @include media-breakpoint-up(md) {
      width: calc((100% - 52px) / 2);
      margin-bottom: 40px;
    }
    @include media-breakpoint-up(xl) {
      width: calc((100% - 72px) / 4);
      margin-bottom: 48px;
    }
    h4 {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin-top: 12px;
    }
    a {
      display: block;
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background-color: $color-grey;
      overflow: hidden;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
      }
    }
  }
}
.g-button-load-more {
  @include media-breakpoint-up(md) {
    margin: 0 auto;
  }
}
</style>
