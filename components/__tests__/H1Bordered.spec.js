import { shallowMount } from '@vue/test-utils'
import H1Bordered from '../H1Bordered.vue'

test('Should render props "text"', function() {
  const textMock = 'textMock'
  const wrapper = shallowMount(H1Bordered, {
    propsData: {
      text: textMock
    }
  })
  expect(wrapper.text()).toBe(textMock)
})
