<script>
import ArticleContentAnnotationHandler from '~/components/ArticleContentAnnotationHandler'
import ArticleContentAudio from '~/components/ArticleContentAudio'
import ArticleContentInfobox from '~/components/ArticleContentInfobox'
import ArticleContentSlideshow from '~/components/ArticleContentSlideshow'
import ArticleContentVideo from '~/components/ArticleContentVideo'
import IframeYoutube from '~/components/IframeYoutube'
import ArticleContentImage from '~/components/ArticleContentImage'

export default {
  functional: true,
  components: {
    ArticleContentAnnotationHandler,
    ArticleContentAudio,
    ArticleContentInfobox,
    ArticleContentSlideshow,
    ArticleContentVideo,
    IframeYoutube,
    ArticleContentImage,
  },
  props: {
    paragraph: {
      type: Object,
      reqired: true,
      default: undefined,
    },
  },
  render(h, { props }) {
    const content = props.paragraph.content?.[0]
    const type = props.paragraph?.type
    switch (type) {
      case 'header-one':
      case 'header-two': {
        const tag = type === 'header-one' ? 'h1' : 'h2'
        return <tag class="g-article-heading" domPropsInnerHTML={content} />
      }
      case 'annotation':
        return (
          <div class="g-article-annotation">
            <ArticleContentAnnotationHandler content={content} />
          </div>
        )
      case 'quoteby':
        return (
          <div class="g-article-quote-by" domPropsInnerHTML={content.quote} />
        )
      case 'embeddedcode':
        return (
          <lazy-component
            class="g-article-embedded-code"
            domPropsInnerHTML={content.embeddedCode}
          />
        )
      case 'infobox':
        return <ArticleContentInfobox infobox={content} />
      case 'slideshow':
        return <ArticleContentSlideshow items={props.paragraph.content} />
      case 'youtube':
        return <IframeYoutube videoId={props.paragraph.content[0].id} />
      case 'video':
        return <ArticleContentVideo video={content} />
      case 'image':
        return <ArticleContentImage image={content} />
      case 'audio':
        return <ArticleContentAudio audio={content} />
      case 'unstyled':
        return <p class="g-article-paragraph" domPropsInnerHTML={content} />
      default:
        return undefined
    }
  },
}
</script>

<style lang="scss">
.g-article {
  &-heading {
    font-size: 20px;
    font-weight: 500;
    line-height: 1.4;
  }
  &-paragraph {
    color: #000;
    font-size: 16px;
    line-height: 1.75;
    text-align: justify;
    > * {
      max-width: 100%;
    }
  }
  &-quote-by {
    position: relative;
    padding: 0 55px;
    line-height: 1.75;
    text-align: justify;
    &::before,
    &::after {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      width: 30px;
      height: 30px;
      background-image: url('~assets/img/quote.svg');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    &::before {
      left: 0;
    }
    &::after {
      right: 0;
      transform: rotate(180deg);
    }
  }
  &-annotation {
    text-align: justify;
    line-height: 1.75;
  }
  &-embedded-code {
    iframe {
      max-width: 100%;
    }
  }
  &-paragraph,
  &-quote-by,
  &-annotation {
    a {
      color: $color-blue;
      font-weight: 500;
    }
  }
}
</style>
