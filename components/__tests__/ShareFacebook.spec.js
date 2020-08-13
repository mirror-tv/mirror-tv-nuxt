import { shallowMount } from '@vue/test-utils'
import ShareFacebook from '../ShareFacebook.vue'

test('Should render props href', function() {
  const urlMock = 'https://www.mirrormedia.mg/'
  const wrapper = shallowMount(ShareFacebook, {
    propsData: {
      url: urlMock
    }
  })
  const iframe = wrapper.get('a')
  expect(iframe.attributes().href).toBe(
    `https://www.facebook.com/share.php?u=${urlMock}`
  )
})
