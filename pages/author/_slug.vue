<template>
  <section class="g-page-with-aside">
    <main class="main">
      <ContactBlock
        :name="contact.name"
        :image="contactImage"
        :facebook="contact.facebook"
        :instatgram="contact.instatgram"
        :profile="contact.bio"
      />
    </main>
    <aside class="g-aside" />
  </section>
</template>

<script>
import { fetchContactBySlug } from '~/apollo/queries/contact.gql'
import ContactBlock from '~/components/ContactBlock'

export default {
  apollo: {
    contact: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
      update(data) {
        return data.allContacts?.[0]
      },
    },
  },
  components: {
    ContactBlock,
  },
  computed: {
    contactImage() {
      return this.contact.image?.urlMobileSized
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  @include media-breakpoint-up(lg) {
    flex: 1;
    padding-right: 118px;
  }
}

.g-aside {
  @include media-breakpoint-up(lg) {
    background-color: #e7e7e7;
  }
}
</style>
