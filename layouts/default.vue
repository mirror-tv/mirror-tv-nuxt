<template>
  <div>
    <Header class="header" />
    <nuxt />
    <Footer class="footer" />
    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import TheGdpr from '~/components/TheGdpr.vue'

import { useViewport } from '~/composition/viewport.js'

export default {
  components: {
    Header,
    Footer,
    TheGdpr,
  },
  setup() {
    useViewport()
  },
}
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  @include media-breakpoint-up(sm) {
    position: static;
  }
}
</style>
