<template>
  <form @submit.prevent>
    <input type="text" :placeholder="placeholder" @input="handleInputChange" />
    <button @click="$emit('submit')">
      <img
        class="search-icon"
        src="~/assets/img/search-gray.svg"
        alt="search"
      />
    </button>
  </form>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInputChange(e) {
      this.$emit('update:input', e.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  /*justify-content: space-between;*/
  align-items: center;
}

input {
  border: 1px solid #c1c2c2;
  height: 30px;
  flex: 1 1 auto;
}

button {
  width: 30px;
  height: 30px;
  margin: 0 0 0 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
