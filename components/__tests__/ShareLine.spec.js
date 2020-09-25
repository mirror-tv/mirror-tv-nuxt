import { shallowMount } from '@vue/test-utils'
import ShareLine from '../ShareLine.vue'

test('Should render props href', function () {
  const urlMock = 'https://www.mirrormedia.mg/'
  const wrapper = shallowMount(ShareLine, {
    propsData: {
      url: urlMock,
    },
  })
  const iframe = wrapper.get('a')
  expect(iframe.attributes().href).toBe(
    `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
      urlMock
    )}`
  )
})
