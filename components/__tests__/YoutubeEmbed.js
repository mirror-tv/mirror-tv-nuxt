import YoutubeEmbed from '~/components/YoutubeEmbed'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', function () {
  const videoId = 'titleMock'
  test('iframe should render src by "videoId" prop', function () {
    const wrapper = createWrapper(YoutubeEmbed, {
      propsData: {
        videoId,
      },
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes().src).toBe(
      `https://www.youtube.com/embed/${videoId}?playsinline=1`
    )
  })
  test('iframe should render src by "videoId" and "enableAutoplay" props', function () {
    const wrapper = createWrapper(YoutubeEmbed, {
      propsData: {
        videoId,
        enableAutoplay: true,
      },
    })
    const iframe = wrapper.find('iframe')
    expect(iframe.attributes().src).toBe(
      `https://www.youtube.com/embed/${videoId}?playsinline=1&autoplay=1&mute=1`
    )
  })
})
