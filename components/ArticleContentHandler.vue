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
import UiEmbeddedCode from '~/components/UiEmbeddedCode'

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
    UiEmbeddedCode,
  },
  props: {
    paragraph: {
      type: Object,
      reqired: true,
      default: undefined,
    },
    insertedYoutubeVideoTitle: {
      type: String,
      default: '',
    },
  },
  render(h, { props }) {
    const content = props.paragraph.content?.[0]
    const type = props.paragraph?.type
    console.log(props.paragraph)
    switch (type) {
      case 'header-one':
      case 'header-two': {
        const tag = type === 'header-one' ? 'h1' : 'h2'
        return <tag class="g-article-heading" domPropsInnerHTML={content} />
      }

      case 'ordered-list-item':
        if (typeof content === 'string') {
          return (
            <ol class="g-article-list order-list">
              <li domPropsInnerHTML={content} />
            </ol>
          )
        } else {
          return (
            <ol class="g-article-list order-list">
              {content.map((item) => {
                return <li domPropsInnerHTML={item} />
              })}
            </ol>
          )
        }

      case 'unordered-list-item':
        if (typeof content === 'string') {
          return (
            <ul class="g-article-list unorder-list">
              <li domPropsInnerHTML={content} />
            </ul>
          )
        } else {
          return (
            <ul class="g-article-list unorder-list">
              {content.map((item) => {
                return <li domPropsInnerHTML={item} />
              })}
            </ul>
          )
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
          <UiEmbeddedCode class="g-article-embedded-code" content={content} />
        )
      case 'infobox':
        return <ArticleContentInfobox infobox={content} />
      case 'slideshow':
        return <ArticleContentSlideshow items={props.paragraph.content} />
      case 'youtube': {
        const youtubeTitle = props.insertedYoutubeVideoTitle
        const id = props.paragraph.content[0].id
        return youtubeTitle ? (
          <div class="g-youtube-with-title">
            <h2 class="g-article-heading">{youtubeTitle}</h2>
            <YoutubeEmbedByIframeApi videoId={id} />
          </div>
        ) : (
          <YoutubeEmbedByIframeApi videoId={id} />
        )
      }
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

<style lang="scss" scoped>
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
      width: 100%;
    }
  }
  &-paragraph,
  &-quote-by,
  &-annotation {
    &::v-deep {
      a {
        color: $color-blue;
        font-weight: 500;
        text-decoration: underline;
      }
    }
  }
  &-list {
    margin-top: 0 !important;
    padding-left: 2rem;
    &.order-list {
      list-style-type: decimal;
    }
    &.unorder-list {
      list-style-type: disc;
    }
    li {
      color: #000;
      font-size: 16px;
      line-height: 1.75;
      text-align: justify;
      &::v-deep {
        a {
          color: $color-blue;
          font-weight: 500;
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
