<template>
  <button>
    <div class="clear-icon">
      <div class="cross-icon" />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.clear-icon {
  width: 19px;
  height: 19px;
  border-radius: 100%;
  background-color: #d8d8d8;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cross-icon {
  position: relative;
  &::before {
    position: absolute;
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    background-color: $color-blue;
    transform: rotate(45deg);
  }
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 12px;
    background-color: $color-blue;
    transform: rotate(-45deg);
  }
}
</style>
