import { shallowMount } from '@vue/test-utils'
import HeaderSearchForm from '~/components/HeaderSearchForm.vue'
import HeaderSearchFormClearButton from '~/components/HeaderSearchFormClearButton'

test('Should emit "update:input" event while user is typing', function () {
  const wrapper = shallowMount(HeaderSearchForm)
  const input = wrapper.find('input')
  const inputValueMock = 'mock'
  input.setValue(inputValueMock)
  expect(wrapper.emitted()['update:input'][0]).toEqual([inputValueMock])
})

test('Should emit "submit" event while submit button clicked', function () {
  const wrapper = shallowMount(HeaderSearchForm)
  const submit = wrapper.find('button')
  submit.trigger('click')
  expect(wrapper.emitted('submit')).toHaveLength(1)
})

test('Should binding proper placeholder via props on input', function () {
  const placeholderMock = 'placeholderMock'
  const wrapper = shallowMount(HeaderSearchForm, {
    propsData: {
      placeholder: placeholderMock,
    },
  })
  const input = wrapper.find('input')
  expect(input.attributes().placeholder).toBe(placeholderMock)
})

test('Should have modifier "input-focused" on search button in mobile when input focused', async function () {
  const wrapper = shallowMount(HeaderSearchForm)
  const input = wrapper.find('input')
  input.trigger('focus')
  await wrapper.vm.$nextTick()
  const submit = wrapper.find('button')
  expect(submit.classes()).toContain('search-button--input-focused')
  input.trigger('blur')
  await wrapper.vm.$nextTick()
  expect(submit.classes()).not.toContain('search-button--input-focused')
})

test('Should emit clear input event and still focus input after clear button clicked', function () {
  const wrapper = shallowMount(HeaderSearchForm, { attachToDocument: true })
  const clearButton = wrapper.findComponent(HeaderSearchFormClearButton)
  const input = wrapper.find('input')
  clearButton.trigger('click')
  expect(wrapper.emitted()['update:input'][0]).toEqual([''])
  expect(input.element).toBe(document.activeElement)
})
