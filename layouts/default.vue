<template>
  <div>
    <Header class="header" />
    <nuxt />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'

export default {
  components: {
    Header
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
