<template>
  <!-- reason why action="." exist: https://stackoverflow.com/questions/4864167/show-search-button-in-iphone-ipad-safari-keyboard -->
  <form action="." @submit.prevent>
    <input
      ref="input"
      type="search"
      :placeholder="placeholder"
      :value="input"
      autofocus
      @input="handleInputChange"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
    />
    <button
      :class="[
        'search-button',
        { 'search-button--input-focused': isInputFocus },
      ]"
      @click="$emit('submit')"
    >
      <svg
        class="search-icon"
        viewBox="0 0 31 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m18.8056157 23.3840749c-4.7601975 2.7191278-10.97311355 2.0109076-15.0851115-2.1010903-4.91450858-4.9145086-4.9670098-12.83000011-.11726475-17.67974515 4.84974504-4.84974505 12.76523655-4.79724383 17.67974515.11726475 4.7237837 4.72378375 4.9556121 12.2201428.6597516 17.1016134l8.1283965 8.2369432-2.8326581 2.8704854zm.6878112-3.890648c3.8105139-3.810514 3.769263-10.02982877-.0921366-13.89122837s-10.0807144-3.90265056-13.89122837-.0921366c-3.81051396 3.81051397-3.769263 10.02982877.0921366 13.89122837s10.08071437 3.9026505 13.89122837.0921366z"
        />
      </svg>
    </button>
    <HeaderSearchFormClearButton
      v-show="input"
      class="clear-button"
      @click.native="handleClearInput"
    />
  </form>
</template>

<script>
import HeaderSearchFormClearButton from '~/components/HeaderSearchFormClearButton'

export default {
  components: {
    HeaderSearchFormClearButton,
  },
  props: {
    input: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isInputFocus: false,
    }
  },
  methods: {
    handleInputChange(e) {
      this.$emit('update:input', e.target.value?.trim())
    },
    handleClearInput() {
      this.$emit('update:input', '')
      this.$refs.input.focus()
    },
    handleInputFocus() {
      this.isInputFocus = true
    },
    handleInputBlur() {
      this.isInputFocus = false
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
  align-items: center;
  position: relative;
}

input {
  outline: 1px solid #c1c2c2;
  height: 40px;
  flex: 1 1 auto;
  padding: 0 40px;
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }
  &:focus {
    outline: 1px solid $color-blue;
    color: $color-blue;
    font-weight: 500;
  }

  @include media-breakpoint-up(md) {
    height: 30px;
    width: 152px;
    padding: 0 0 0 8px; // 修正 cursor/caret 的位置
    &:focus {
      outline: 1px solid #c1c2c2;
      color: initial;
      font-weight: initial;
    }
  }
}

.search-button {
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 18px;
    height: 18px;

    path {
      fill: #c1c2c2;
    }
  }

  @include media-breakpoint-up(md) {
    width: 48px;
    height: 48px;
    padding: 9px;
    margin: 0 0 0 1px;
    position: static;
    svg {
      width: 100%;
      height: 100%;

      path {
        fill: #c1c2c2;
      }
    }
  }

  &--input-focused {
    svg path {
      fill: $color-blue;
    }

    @include media-breakpoint-up(md) {
      svg path {
        fill: #c1c2c2;
      }
    }
  }
}

.clear-button {
  position: absolute;
  right: 8px;
  @include media-breakpoint-up(md) {
    display: none;
  }
}
</style>
