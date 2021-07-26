<template>
  <section class="g-page schedule">
    <div class="g-page__wrapper">
      <ScheduleDatepicker @update-schedule="updateSchedule" />
      <ScheduleTable
        v-if="hasSchedules"
        :schedules="formatSchedules"
        class="schedule__table"
      />
      <template v-else>
        <img
          class="schedule__image"
          src="~/assets/img/magnifier-with-question-mark.png"
          alt="找不到當日節目表"
        />
        <span>找不到當日節目表</span><br />
        <span>請選擇其他日查看</span>
      </template>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import _ from 'lodash'

import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import ScheduleDatepicker from '~/components/ScheduleDatepicker'
import ScheduleTable from '~/components/ScheduleTable'

const dayOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

const mockWeek = ['11', '12', '13', '14', '15', '16', '17']

export default {
  components: {
    ScheduleDatepicker,
    ScheduleTable,
  },
  data() {
    return {
      schedules: [],
      requestData: [],
    }
  },
  async fetch() {
    try {
      const day = dayOfWeek[dayjs().day()]
      const data = await this.$fetchGcsData('/program_list')
      this.schedules = this.initData(data)
      this.requestData = this.getData(day)
    } catch (err) {
      if (process.server) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
  },
  head() {
    const title = `節目表 - ${SITE_NAME}`
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getUrlOrigin(this.$config)}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    formatSchedules() {
      return this.requestData ?? []
    },
    hasSchedules() {
      return this.formatSchedules.length
    },
  },
  methods: {
    initData(data) {
      return data.filter((item) => mockWeek.includes(item.Day))
    },
    getData(day) {
      const data = this.schedules?.filter(
        (item) => this.formatDay(item.WeekDay) === day
      )
      return this.sortData(data)
    },
    updateSchedule(dayOfWeekIndex) {
      const day = dayOfWeek[dayOfWeekIndex]
      this.requestData = this.getData(day)
    },
    sortData(data) {
      return _.sortBy(data, ['Start Time(hh)', 'Start Time(mm)'])
    },
    formatDay(day) {
      let data = ''
      switch (day) {
        case 'sun':
          data = 'sunday'
          break
        case 'mon':
          data = 'monday'
          break
        case 'tue':
          data = 'tuesday'
          break
        case 'wed':
          data = 'wednesday'
          break
        case 'thu':
          data = 'thursday'
          break
        case 'fri':
          data = 'friday'
          break
        case 'sat':
          data = 'saturday'
          break
        default:
          break
      }
      return data
    },
  },
}
</script>

<style lang="scss" scoped>
.schedule {
  &.g-page {
    padding-top: calc(50px + 20px);
    padding-bottom: 48px;
    @include media-breakpoint-up(sm) {
      padding-top: 20px;
      padding-left: 16px;
      padding-right: 16px;
    }
    @include media-breakpoint-up(md) {
      padding-top: 48px;
      padding-bottom: 32px;
    }
    @include media-breakpoint-up(xl) {
      padding-top: 60px;
      padding-bottom: 60px;
    }
  }
  .g-page__wrapper {
    max-width: 600px;
    text-align: center;
    @include media-breakpoint-up(md) {
      display: block;
    }
    @include media-breakpoint-up(xl) {
      max-width: 992px;
    }
    > span {
      color: #9b9b9b;
    }
  }
  &__table {
    max-width: 600px;
    margin: 24px auto 0;
    @include media-breakpoint-up(xl) {
      margin-top: 48px;
    }
  }
  &__image {
    margin: 50px auto 12px;
    @include media-breakpoint-up(md) {
      margin-top: 62px auto 12px;
    }
    @include media-breakpoint-up(xl) {
      margin-top: 82px auto 18px;
    }
  }
}
</style>
