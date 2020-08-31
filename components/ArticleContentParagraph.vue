<template>
  <div :class="type" class="paragraph">
    <h1 v-if="type === 'header-one'" v-html="content" />
    <h2 v-if="type === 'header-two'" v-html="content" />
    <p v-if="type === 'unstyled'" v-html="content" />
    <span v-if="type === 'quoteby'" v-text="content.quote" />
    <div v-if="type === 'embeddedcode'" v-html="content.embeddedCode" />
    <ArticleContentInfobox v-if="type === 'infobox'" :infobox="content" />
    <IframeYoutube v-if="type === 'youtube'" :videoId="content.id" />
    <ArticleContentVideo v-if="type === 'video'" :video="content" />
    <ArticleContentAudio v-if="type === 'audio'" :audio="content" />
  </div>
</template>

<script>
import ArticleContentAudio from '~/components/ArticleContentAudio'
import ArticleContentInfobox from '~/components/ArticleContentInfobox'
import ArticleContentVideo from '~/components/ArticleContentVideo'
import IframeYoutube from '~/components/IframeYoutube'

export default {
  components: {
    ArticleContentAudio,
    ArticleContentInfobox,
    ArticleContentVideo,
    IframeYoutube
  },
  props: {
    paragraph: {
      type: Object,
      reqired: true,
      default: undefined
    }
  },
  computed: {
    content() {
      return this.paragraph.content?.[0]
    },
    type() {
      return this.paragraph.type
    }
  }
}
</script>

<style lang="scss" scoped>
.paragraph {
  color: #000000;
  font-size: 16px;
  + .paragraph {
    margin-top: 30px;
  }
  h1,
  h2 {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
  }
  p {
    line-height: 1.75;
    text-align: justify;
  }
  a {
    color: #014db8;
    font-weight: 500;
  }
  &.embeddedcode {
    ::v-deep iframe {
      max-width: 100%;
    }
  }
  &.quoteby {
    position: relative;
    padding: 0 55px;
    line-height: 1.75;
    text-align: justify;
    ::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      background-image: url('~assets/img/quote.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    ::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      background-image: url('~assets/img/quote.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
      transform: rotate(180deg);
    }
  }
}
</style>
