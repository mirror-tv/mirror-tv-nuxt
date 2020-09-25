<template>
  <video preload="metadata" controls>
    <source :src="video.url" />
  </video>
</template>

<script>
export default {
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
}
</style>
