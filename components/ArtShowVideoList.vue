<template>
  <div class="artShow_list_wrapper">
    <ol>
      <li v-for="artShow in artShowList" :key="artShow.slug">
        <a
          :href="`/show/${currentShow}/video/${artShow.slug}`"
          rel="noreferer noopener"
          @click="handleClickVideo"
        >
          <img :src="getVideoImage(artShow)" :alt="artShow.name" />
        </a>
        <h4 v-text="artShow.name" />
      </li>
      <div class="position-correct" />
    </ol>
    <ButtonLoadmore
      v-show="showLoadMoreButton"
      class="g-button-load-more"
      @click.native="handleClickMore"
    />
  </div>
</template>

<script>
import { getVideoImageUrl } from '~/utils/post-image-handler'
import ButtonLoadmore from '~/components/ButtonLoadmore'

export default {
  components: {
    ButtonLoadmore,
  },
  props: {
    artShowList: {
      type: Array,
      default: () => [],
      required: true,
    },
    currentShow: {
      type: String,
      required: true,
      default: '',
    },
    showLoadMoreButton: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  methods: {
    handleClickVideo() {
      this.$emit('click-video')
    },
    handleClickMore() {
      this.$emit('click-more-button')
    },
    getVideoImage(item) {
      return getVideoImageUrl(item)
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
    .position-correct {
      width: calc((100% - 52px) / 2);
      overflow: hidden;
    }
  }
  @include media-breakpoint-up(xl) {
    &::after {
      content: '';
      width: calc((100% - 72px) / 4);
    }
    .position-correct {
      width: calc((100% - 72px) / 4);
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
    margin: 0 0 20px;
    @include media-breakpoint-up(md) {
      width: calc((100% - 52px) / 2);
      margin: 0 0 24px;
    }
    @include media-breakpoint-up(xl) {
      width: calc((100% - 72px) / 4);
      margin: 0 0 48px;
    }
    @include media-breakpoint-up(xxl) {
      width: calc((100% - 48px) / 4);
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
