<template>
  <div>
    <Header
      class="header"
      @click-hamburger-button="handleClickHamburgerButton($event)"
    />
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
    function handleClickHamburgerButton(payload) {
      if (payload) {
        const scrollY = window.scrollY
        document.body.style.overflow = 'hidden'
        document.body.style.top = `-${scrollY}px`
      } else {
        const scrollY = document.body.style.top
        document.body.style.overflow = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    useViewport()

    return {
      handleClickHamburgerButton,
    }
  },
}
</script>

<style lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  @include media-breakpoint-up(md) {
    position: static;
  }
}
</style>
