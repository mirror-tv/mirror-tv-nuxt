<template>
  <div>
    <Header class="header" />
    <nuxt />
    <Footer class="footer" />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  @include media-breakpoint-up(xl) {
    position: static;
  }
}
</style>
