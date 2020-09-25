<script>
import ArticleContentAnnotation from '~/components/ArticleContentAnnotation'

function isAnnotation(item) {
  return item.constructor.name === 'Object'
}

function splitContent(content) {
  return content
    .split(/<!--__ANNOTATION__=|-->/)
    .filter((item) => !item.match(/<!--/))
    .map((item) => {
      try {
        return JSON.parse(item)
      } catch (error) {
        return item
      }
    })
}

export default {
  functional: true,
  components: {
    ArticleContentAnnotation,
  },
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  render(h, { props }) {
    const contentSplit = splitContent(props.content)
    return contentSplit.map((item) => {
      if (isAnnotation(item)) {
        return <ArticleContentAnnotation annotation={item} />
      } else {
        return <span domPropsInnerHTML={item} />
      }
    })
  },
}
</script>
