import ScheduleTable from '~/components/ScheduleTable'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('items from schedules prop', function () {
  const mockSchedules = [
    {
      id: '1',
      name: 'show1',
      hour: '00',
      minute: '00',
      parentalGuidelines: '普遍級',
      replay: false,
      showUrl: {
        slug: 'test',
      },
    },
    {
      id: '2',
      name: 'show2',
      hour: '02',
      minute: '00',
      parentalGuidelines: '普遍級',
      replay: true,
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
      `${mockSchedules[0].hour}:${mockSchedules[0].minute}-${mockSchedules[1].hour}:${mockSchedules[1].minute}`
    )
    expect(showTimeItems.at(1).text()).toBe(
      `${mockSchedules[1].hour}:${mockSchedules[1].minute}-24:00`
    )
  })
  test('Should render proper show url', function () {
    const showNameItems = wrapper.findAll('tbody .show__name')
    expect(showNameItems.at(0).get('a').attributes().href).toBe(
      `/show/${mockSchedules[0].showUrl.slug}`
    )
    expect(showNameItems.at(1).find('a').exists()).toBe(false)
  })
  test('Should render proper show name', function () {
    const showNameItems = wrapper.findAll('tbody .show__name')
    expect(showNameItems.at(0).text()).toContain(`${mockSchedules[0].name}`)
    expect(showNameItems.at(0).text()).toContain(`（新播）`)
    expect(showNameItems.at(1).text()).toContain(`${mockSchedules[1].name}`)
    expect(showNameItems.at(1).text()).toContain(`（重播）`)
  })
  test('Should render proper show rating', function () {
    const showRatingItems = wrapper.findAll('tbody .show__rating')
    expect(showRatingItems.at(0).text()).toBe(
      `${mockSchedules[0].parentalGuidelines}`
    )
    expect(showRatingItems.at(1).text()).toBe(
      `${mockSchedules[1].parentalGuidelines}`
    )
  })
})
