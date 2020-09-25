import { shallowMount } from '@vue/test-utils'
import ArticleContentVideo from '../ArticleContentVideo.vue'

test('Should render proper video src from props', function () {
  const urlMock = 'https://files/20200811034627-5f32149393939900245cabc9.mov'
  const wrapper = shallowMount(ArticleContentVideo, {
    propsData: {
      video: {
        url: urlMock,
      },
    },
  })
  const video = wrapper.get('video source')
  expect(video.attributes().src).toBe(urlMock)
})
