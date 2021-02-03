import dayjs from 'dayjs'
import ScheduleDatepicker from '~/components/ScheduleDatepicker'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

const dayOfWeekZh = ['日', '一', '二', '三', '四', '五', '六']
const now = dayjs()

const wrapper = createWrapper(ScheduleDatepicker)
describe('options', function () {
  test('Should render proper option text', function () {
    const options = wrapper.findAll('select option')
    options.wrappers.forEach((option, index) => {
      const day = now.add(index, 'day')
      expect(option.text()).toContain(
        `${day.format('YYYY/MM/DD')}（${dayOfWeekZh[day.day()]}）`
      )
    })
  })
})

describe('buttons', function () {
  test('Should render proper button text', function () {
    const buttons = wrapper.findAll('select button')
    buttons.wrappers.forEach((button, index) => {
      const day = now.add(index, 'day')
      expect(button.text()).toContain(`星期${dayOfWeekZh[day.day()]}`)
      expect(button.text()).toContain(day.format('MM/DD'))
    })
  })
})

describe('emit update-schedule when selectedDayOfWeek changed', function () {
  test('Should emit update-schedule event when change select option', async function () {
    const option = wrapper.findAll('option').at(1)
    await option.setSelected()
    expect(wrapper.emitted()['update-schedule']).toBeTruthy()
    expect(wrapper.emitted()['update-schedule'][0]).toEqual([
      now.add(1, 'day').day(),
    ])
  })
  test('Should emit update-schedule event when click button', async function () {
    wrapper.emitted()['update-schedule'] = []
    const button = wrapper.findAll('button').at(2)
    await button.trigger('click')
    expect(wrapper.emitted()['update-schedule']).toBeTruthy()
    expect(wrapper.emitted()['update-schedule'][0]).toEqual([
      now.add(2, 'day').day(),
    ])
  })
})
