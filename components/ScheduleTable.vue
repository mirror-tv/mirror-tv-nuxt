<template>
  <table class="schedule-table">
    <thead>
      <tr>
        <th class="show__time">時間</th>
        <th class="show__name">節目名稱</th>
        <th class="show__rating">分級</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item, index) in schedules"
        :key="`${item.Programme}-${item['Start Time(hh)']}-${index}`"
      >
        <td
          class="show__time"
          v-text="
            `${formatHourTime(item['Start Time(hh)'])}:${formatMinuteTime(
              item['Start Time(mm)']
            )}-${getShowEndTime(index)}`
          "
        />
        <td class="show__name">
          {{ item.Programme }}
          <span
            :class="{ replay: isReplay(item) }"
            v-text="`（${isReplay(item) ? '重' : '新'}播）`"
          />
        </td>
        <td class="show__rating" v-text="item.Class" />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    schedules: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    formatHourTime(time) {
      const stringTime = time.toString()
      if (stringTime.length > 1) {
        return stringTime
      } else {
        return '0' + stringTime
      }
    },
    formatMinuteTime(time) {
      const stringTime = time.toString()
      if (stringTime.length > 1) {
        return stringTime
      } else {
        return stringTime + '0'
      }
    },
    getShowEndTime(index) {
      const nextShowIndex = index + 1
      if (nextShowIndex >= this.schedules.length) {
        return '24:00'
      }
      return `${this.formatHourTime(
        this.schedules[nextShowIndex]['Start Time(hh)']
      )}:${this.formatMinuteTime(
        this.schedules[nextShowIndex]['Start Time(mm)']
      )}`
    },
    isReplay(item) {
      return item?.TxCategory === 'Repeat'
    },
  },
}
</script>

<style lang="scss" scoped>
.schedule-table {
  width: 100%;
  color: #4a4a4a;
  thead {
    th {
      text-align: left;
    }
    th.show__rating {
      color: #4a4a4a;
    }
  }
  tbody {
    td {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
    }
    tr + tr {
      border-top: 1px solid #d8d8d8;
    }
    span.replay {
      color: #9b9b9b;
    }
  }
  .show {
    &__time {
      min-width: 100px;
      @include media-breakpoint-up(md) {
        width: 198px;
        padding-left: 38px;
      }
      @include media-breakpoint-up(xl) {
        width: 200px;
      }
    }
    &__name {
      padding-left: 10px;
      padding-right: 10px;
      @include media-breakpoint-up(md) {
        width: 300px;
      }
      @include media-breakpoint-up(xl) {
        width: 300px;
      }
      a {
        color: $color-blue;
      }
    }
    &__rating {
      display: none;
      color: #9b9b9b;
      @include media-breakpoint-up(md) {
        display: table-cell;
        padding-right: 12px;
      }
    }
  }
}
</style>
