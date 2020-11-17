<template>
  <section class="g-page">
    <h1 class="g-listing-heading" v-text="routeName" />
  </section>
</template>

<script>
import { fetchPostsByTagName } from '~/apollo/queries/posts.gql'

export default {
  name: 'TagPage',
  apollo: {
    posts: {
      query: fetchPostsByTagName,
      variables() {
        return {
          tagName: this.routeName,
        }
      },
      update: (data) => data.allPosts,
      error() {
        this.$nuxt.error({ statusCode: 500 })
      },
    },
  },
  computed: {
    routeName() {
      return this.$route.params.name
    },
  },
}
</script>
