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
      <tr v-for="(item, index) in schedules" :key="item.id">
        <td
          class="show__time"
          v-text="`${item.hour}:${item.minute}-${getShowEndTime(index)}`"
        />
        <td class="show__name">
          {{ item.name }}
          <span
            :class="{ replay: isReplay(item) }"
            v-text="`（${isReplay(item) ? '重' : '新'}播）`"
          />
        </td>
        <td class="show__rating" v-text="item.parentalGuidelines" />
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
    getShowEndTime(index) {
      const nextShowIndex = index + 1
      if (nextShowIndex >= this.schedules.length) {
        return '24:00'
      }
      return `${this.schedules[nextShowIndex].hour}:${this.schedules[nextShowIndex].minute}`
    },
    isReplay(item) {
      return item?.replay
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
        padding-left: 24px;
      }
    }
    &__name {
      padding-left: 10px;
      padding-right: 10px;
    }
    &__rating {
      display: none;
      color: #9b9b9b;
      @include media-breakpoint-up(md) {
        display: table-cell;
        padding-right: 24px;
      }
    }
  }
}
</style>
