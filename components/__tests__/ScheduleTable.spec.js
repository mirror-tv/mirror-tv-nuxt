import ScheduleTable from '~/components/ScheduleTable'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('items from schedules prop', function () {
  const mockSchedules = [
    {
      Year: 2021,
      'Start Time(hh)': 0,
      'Start Time(mm)': 0,
      Programme: 'show1',
      Class: '普遍級',
      TxCategory: 'Premier',
      Month: 5,
      Day: 23,
    },
    {
      Year: 2021,
      'Start Time(hh)': 2,
      'Start Time(mm)': 0,
      Programme: 'show2',
      Class: '普遍級',
      TxCategory: 'Repeat',
      Month: 5,
      Day: 23,
    },
  ]
  const wrapper = createWrapper(ScheduleTable, {
    propsData: {
      schedules: mockSchedules,
    },
  })
  test('Should render proper show duration', function () {
    const showTimeItems = wrapper.findAll('tbody .show__time')
    expect(showTimeItems.at(0).text()).toBe(
      `0${mockSchedules[0]['Start Time(hh)']}:${mockSchedules[0]['Start Time(mm)']}0-0${mockSchedules[1]['Start Time(hh)']}:${mockSchedules[1]['Start Time(mm)']}0`
    )
    expect(showTimeItems.at(1).text()).toBe(
      `0${mockSchedules[1]['Start Time(hh)']}:${mockSchedules[1]['Start Time(mm)']}0-24:00`
    )
  })
  test('Should render proper show name', function () {
    const showNameItems = wrapper.findAll('tbody .show__name')
    expect(showNameItems.at(0).text()).toContain(
      `${mockSchedules[0].Programme}`
    )
    expect(showNameItems.at(0).text()).toContain(`（新播）`)
    expect(showNameItems.at(1).text()).toContain(
      `${mockSchedules[1].Programme}`
    )
    expect(showNameItems.at(1).text()).toContain(`（重播）`)
  })
  test('Should render proper show rating', function () {
    const showRatingItems = wrapper.findAll('tbody .show__rating')
    expect(showRatingItems.at(0).text()).toBe(`${mockSchedules[0].Class}`)
    expect(showRatingItems.at(1).text()).toBe(`${mockSchedules[1].Class}`)
  })
})
