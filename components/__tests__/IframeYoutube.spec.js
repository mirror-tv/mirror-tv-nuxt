import { shallowMount } from '@vue/test-utils'
import IframeYoutube from '../IframeYoutube.vue'

test('Should render props iframe src', function () {
  const videoIdMock = 'test'
  const wrapper = shallowMount(IframeYoutube, {
    propsData: {
      videoId: videoIdMock,
    },
  })
  const iframe = wrapper.get('iframe')
  expect(iframe.attributes().src).toBe(
    `https://www.youtube.com/embed/${videoIdMock}`
  )
})
