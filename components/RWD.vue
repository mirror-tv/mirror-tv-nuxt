<template>
  <div class="RWD">
    <div>{{ width }}</div>
    <div>{{ getDevice }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 1,
    }
  },
  computed: {
    getDevice() {
      if (this.width <= 576) {
        return 'mobile sm'
      } else if (this.width <= 720) {
        return 'tablet md'
      } else if (this.width <= 992) {
        return 'desktop lg'
      } else if (this.width <= 1200) {
        return 'desktop xl'
      } else {
        return 'desktop xxl'
      }
    },
  },
  mounted() {
    this.getWidth()
  },
  methods: {
    getWidth() {
      if (process.client) {
        this.width = document.body.clientWidth
        window.addEventListener('resize', () => {
          this.width = document.body.clientWidth
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.RWD {
  position: fixed;
  width: 150px;
  height: 80px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: white;
  border: 5px solid red;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
