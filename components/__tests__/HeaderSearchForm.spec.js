import { shallowMount } from '@vue/test-utils'
import HeaderSearchForm from '~/components/HeaderSearchForm.vue'

test('Should emit "update:input" event while user is typing', function() {
  const wrapper = shallowMount(HeaderSearchForm)
  const input = wrapper.find('input')
  const inputValueMock = 'mock'
  input.setValue(inputValueMock)
  expect(wrapper.emitted()['update:input'][0]).toEqual([inputValueMock])
})

test('Should emit "submit" event while submit button clicked', function() {
  const wrapper = shallowMount(HeaderSearchForm)
  const submit = wrapper.find('button')
  submit.trigger('click')
  expect(wrapper.emitted('submit')).toHaveLength(1)
})

test('Should binding proper placeholder via props on input', function() {
  const placeholderMock = 'placeholderMock'
  const wrapper = shallowMount(HeaderSearchForm, {
    propsData: {
      placeholder: placeholderMock
    }
  })
  const input = wrapper.find('input')
  expect(input.attributes().placeholder).toBe(placeholderMock)
})
