<script>
import ArticleContentAnnotationHandler from '~/components/ArticleContentAnnotationHandler'
import ArticleContentAudio from '~/components/ArticleContentAudio'
import ArticleContentInfobox from '~/components/ArticleContentInfobox'
import ArticleContentSlideshow from '~/components/ArticleContentSlideshow'
import ArticleContentVideo from '~/components/ArticleContentVideo'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import ArticleContentImage from '~/components/ArticleContentImage'
import ArticleContentBlockQuote from '~/components/ArticleContentBlockQuote'
import ArticleContentQuoteBy from '~/components/ArticleContentQuoteBy'

export default {
  functional: true,
  components: {
    ArticleContentAnnotationHandler,
    ArticleContentAudio,
    ArticleContentInfobox,
    ArticleContentSlideshow,
    ArticleContentVideo,
    YoutubeEmbedByIframeApi,
    ArticleContentImage,
    ArticleContentBlockQuote,
    ArticleContentQuoteBy,
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
      case 'blockquote':
        return (
          <ArticleContentBlockQuote
            class="g-article-blockquote"
            blockquote={content}
          />
        )
      case 'quoteby':
        return (
          <ArticleContentQuoteBy class="g-article-quote-by" content={content} />
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
        return (
          <YoutubeEmbedByIframeApi videoId={props.paragraph.content[0].id} />
        )
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
