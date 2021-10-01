<template>
  <div>
    <ArticleCardColumnInMobile
      v-if="mobileLayoutDirection === 'column'"
      v-bind="$props"
    />
    <ArticleCardRowInMobile
      v-else-if="mobileLayoutDirection === 'row'"
      v-bind="$props"
    />
  </div>
</template>

<script>
import ArticleCardColumnInMobile from './ArticleCardColumnInMobile'
import ArticleCardRowInMobile from './ArticleCardRowInMobile'

export default {
  components: {
    ArticleCardColumnInMobile,
    ArticleCardRowInMobile,
  },
  props: {
    href: {
      type: String,
      default: '',
    },
    labelTitle: {
      type: String,
      default: '',
    },
    articleTitleStyle: {
      type: String,
      default: 'normal',
    },
    articleTitleHighlightText: {
      type: String,
      default: '',
    },
    articleImgURL: {
      type: String,
      default: require('~/assets/img/default/image-default.jpg'),
    },
    articleTitle: {
      type: String,
      default: '',
    },
    articleDescription: {
      type: String,
      default: '',
    },
    articleDate: {
      type: Date,
      default: () => new Date(),
    },
    articleStyle: {
      type: String,
      default: null,
    },
    isMicroAd: {
      type: Boolean,
      default: false,
    },
    microAdId: {
      type: String,
      default: '',
    },

    // Differentiate two usages in / and /category/:name pages
    mobileLayoutDirection: {
      type: String,
      default: 'row',
      validator(value) {
        return ['row', 'column'].includes(value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
div {
  height: 100%;
}
</style>
