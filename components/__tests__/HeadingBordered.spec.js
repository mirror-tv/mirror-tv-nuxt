import { shallowMount } from '@vue/test-utils'
import HeadingBordered from '../HeadingBordered.vue'

test('Should render props "text"', function() {
  const textMock = 'textMock'
  const wrapper = shallowMount(HeadingBordered, {
    propsData: {
      text: textMock
    }
  })
  expect(wrapper.text()).toBe(textMock)
})
