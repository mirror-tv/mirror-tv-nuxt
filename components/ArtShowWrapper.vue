<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="showName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <ArtShowNavbar
        v-if="shouldShowNavbar"
        :currentShow="currentShow"
        :currentSection="currentSection"
        :gaCategory="gaCategory"
        :sectionList="sectionList"
      />
      <ArtShowBreadCrum
        v-if="shouldShowBreadCrum"
        :section="section"
        :series="series"
        :artShow="artShow"
      />
      <slot />
    </div>
  </section>
</template>

<script>
import ArtShowNavbar from '~/components/ArtShowNavbar'
import ArtShowBreadCrum from '~/components/ArtShowBreadCrum'

export default {
  components: {
    ArtShowNavbar,
    ArtShowBreadCrum,
  },
  props: {
    currentShow: {
      type: String,
      required: true,
      default: 'art',
    },
    currentSection: {
      type: String,
      required: true,
      default: 'series',
    },
    showName: {
      type: String,
      default: '',
      required: true,
    },
    picture: {
      type: Object,
      default: () => {},
    },
    shouldShowNavbar: {
      type: Boolean,
      default: false,
    },
    shouldShowBreadCrum: {
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
    section: {
      type: Object,
      default: () => {},
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
.show {
  &.g-page {
    padding-left: 16px;
    padding-right: 16px;
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
    line-height: 28px;
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
