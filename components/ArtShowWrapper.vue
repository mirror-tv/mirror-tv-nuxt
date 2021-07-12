<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="showName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <ArtShowNavbar
        v-show="shouldShowNavbar"
        :currentSlug="currentSlug"
        :currentPage="currentPage"
        :gaCategory="gaCategory"
        :sectionList="sectionList"
      />
      <slot />
    </div>
  </section>
</template>

<script>
import ArtShowNavbar from '~/components/ArtShowNavbar'

export default {
  components: {
    ArtShowNavbar,
  },
  props: {
    currentSlug: {
      type: String,
      required: true,
    },
    currentPage: {
      type: String,
      required: true,
    },
    showName: {
      type: String,
      default: '',
      required: true,
    },
    picture: {
      type: Object,
      default: () => {},
      required: false,
    },
    shouldShowNavbar: {
      type: Boolean,
      default: false,
    },
    gaCategory: {
      type: String,
      default: 'ArtShow',
    },
    sectionList: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.show {
  &.g-page {
    @include media-breakpoint-up(sm) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  &.g-page--with-aside {
    .g-page__wrapper {
      max-width: 688px;
      @include media-breakpoint-up(xl) {
        max-width: 1120px;
        display: flex;
        flex-wrap: wrap;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1200px;
      }
    }
  }
  &__name {
    color: $color-blue;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0.5px;
    margin: 12px 0;
    @include media-breakpoint-up(md) {
      width: 100%;
      font-size: 30px;
      line-height: 42px;
    }
  }
  &__banner-image {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    margin: 18px auto 0;
    padding-top: 37.5%;
    transform: translateX(-16px);
    @include media-breakpoint-up(md) {
      width: 100%;
      transform: none;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}
</style>
