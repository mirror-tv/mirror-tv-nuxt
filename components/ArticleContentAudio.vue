<template>
  <audio controls>
    <source :src="audio.url" />
  </audio>
</template>

<script>
export default {
  props: {
    audio: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
audio {
  width: 100%;
}
</style>
