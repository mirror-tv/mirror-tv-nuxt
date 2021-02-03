<template>
  <div :class="{ focused }" class="datepicker-wrapper">
    <select
      v-model="selectedDayOfWeek"
      class="datepicker datepicker--md"
      @focus="handleFocusEvent"
      @blur="handleBlurEvent"
    >
      <option v-for="n in 7" :key="n" :value="addDay(n - 1).day()">
        {{ formatDate(addDay(n - 1)) }}（{{ getDayOfWeek(addDay(n - 1)) }}）
      </option>
    </select>
    <div class="datepicker datepicker--xxl">
      <button
        v-for="n in 7"
        :key="`btn-${n}`"
        :class="{ active: addDay(n - 1).day() === selectedDayOfWeek }"
        class="datepicker__option option"
        @click="selectDay(n)"
      >
        <span
          class="option__day"
          v-text="`星期${getDayOfWeek(addDay(n - 1))}`"
        />
        <br />
        <span v-text="formatDate(addDay(n - 1), 'MM/DD')" />
      </button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

const dayOfWeekZh = ['日', '一', '二', '三', '四', '五', '六']

export default {
  data() {
    return {
      now: dayjs(),
      selectedDayOfWeek: dayjs().day(),
      focused: false,
    }
  },
  watch: {
    selectedDayOfWeek(value) {
      this.$emit('update-schedule', value)
    },
  },
  methods: {
    addDay(amount) {
      return this.now.add(amount, 'day')
    },
    formatDate(day, format = 'YYYY/MM/DD') {
      return day.format(format)
    },
    getDayOfWeek(day) {
      return dayOfWeekZh[day.day()]
    },
    handleFocusEvent() {
      this.focused = true
    },
    handleBlurEvent() {
      this.focused = false
    },
    selectDay(index) {
      this.selectedDayOfWeek = this.addDay(index - 1).day()
    },
  },
}
</script>

<style lang="scss" scoped>
.datepicker-wrapper {
  position: relative;
  &::after {
    content: '';
    display: block;
    position: absolute;
    top: calc(50% - 2px);
    right: 16px;
    transform: translateY(-50%) rotate(-45deg);
    width: 12px;
    height: 12px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
    pointer-events: none;
  }
  &.focused {
    &::after {
      top: calc(50% + 2px);
      transform: translateY(-50%) rotate(135deg);
    }
  }
  @include media-breakpoint-up(xxl) {
    position: static;
  }
}

.datepicker {
  width: 100%;
  padding: 12px 16px;
  color: #fff;
  background-color: #014db8;
  cursor: pointer;
  appearance: none;
  @include media-breakpoint-up(md) {
    padding: 12px 24px;
  }
  @include media-breakpoint-up(xxl) {
    background-color: transparent;
    cursor: default;
  }
  &--md {
    @include media-breakpoint-up(xxl) {
      display: none;
    }
  }
  &--xxl {
    display: none;
    @include media-breakpoint-up(xxl) {
      display: flex;
      justify-content: space-between;
      padding: 0;
    }
  }
  &__option {
    br + span {
      margin-top: 12px;
    }
  }
  .option {
    width: 138px;
    height: 102px;
    color: #4a4a4a;
    background-color: #e7e7e7;
    span {
      display: inline-block;
    }
    &__day {
      font-size: 26px;
      line-height: 30px;
      font-weight: 500;
    }
    &.active {
      color: #fff;
      background-color: #014db8;
    }
  }
}
</style>
