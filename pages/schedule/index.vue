<template>
  <section class="g-page schedule">
    <div class="g-page__wrapper">
      <ScheduleDatepicker @update-schedule="updateSchedule" />
      <ScheduleTable
        v-if="hasSchedules"
        :schedules="schedules"
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

import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { fetchSchedules } from '~/apollo/queries/schedules.gql'
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

export default {
  apollo: {
    schedules: {
      query: fetchSchedules,
      variables() {
        const day = dayOfWeek[dayjs().day()]
        return {
          where: { [day]: true },
        }
      },
      update: (data) => data.allSchedules,
    },
  },
  components: {
    ScheduleDatepicker,
    ScheduleTable,
  },
  data() {
    return {
      schedules: [],
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
          content: `${getDomain()}${this.$route.path}`,
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
    hasSchedules() {
      return this.schedules.length
    },
  },
  methods: {
    updateSchedule(dayOfWeekIndex) {
      const day = dayOfWeek[dayOfWeekIndex]
      this.$apollo.queries.schedules.refetch({
        where: { [day]: true },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.schedule {
  &.g-page {
    padding-top: calc(50px + 20px);
    padding-bottom: 48px;
    @include media-breakpoint-up(md) {
      padding-top: calc(50px + 24px);
      padding-bottom: 32px;
    }
    @include media-breakpoint-up(xxl) {
      padding-top: 24px;
      padding-bottom: 60px;
    }
  }
  .g-page__wrapper {
    max-width: 552px;
    text-align: center;
    @include media-breakpoint-up(xxl) {
      max-width: 1014px;
    }
    > span {
      color: #9b9b9b;
    }
  }
  &__table {
    max-width: 600px;
    margin: 24px auto 0;
    @include media-breakpoint-up(xxl) {
      margin-top: 48px;
    }
  }
  &__image {
    margin: 50px auto 12px;
    @include media-breakpoint-up(md) {
      margin-top: 62px auto 12px;
    }
    @include media-breakpoint-up(xxl) {
      margin-top: 82px auto 18px;
    }
  }
}
</style>
