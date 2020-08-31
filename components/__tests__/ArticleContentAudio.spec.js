import { shallowMount } from '@vue/test-utils'
import ArticleContentAudio from '../ArticleContentAudio.vue'

test('Should render proper audio src from props', function() {
  const urlMock = 'https://files/20200811034627-5f32149393939900245cabc9.aac'
  const wrapper = shallowMount(ArticleContentAudio, {
    propsData: {
      audio: {
        url: urlMock
      }
    }
  })
  const audio = wrapper.get('audio source')
  expect(audio.attributes().src).toBe(urlMock)
})
