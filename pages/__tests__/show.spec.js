import page from '../show/_slug/index.vue'
import FacebookPagePlugin from '../../components/FacebookPagePlugin'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const mockShow = {
  bannerImg: {
    urlDesktopSized: 'https://image.com',
  },
  facebookUrl: 'https://facebook.com',
  introduction: 'test',
  picture: {
    urlDesktopSized: 'https://image.com/a',
    urlMobileSized: 'https://image.com/b',
  },
  name: 'scheduleName',
}

const createWrapper = createWrapperHelper({
  data() {
    return {
      show: mockShow,
      playlists: [
        {
          id: 'mock1001',
          sectionName: 'mock',
          nextPageToken: 'mock',
          items: [
            { id: 'mock001', title: 'mock' },
            { id: 'mock002', title: 'mock' },
            { id: 'mock003', title: 'mock' },
          ],
        },
      ],
    }
  },
})

describe('page content', () => {
  const wrapper = createWrapper(page)
  // test('Should have proper leading image', () => {
  //   const pictureImage = wrapper.get('picture img')
  //   const pictureSource = wrapper.get('picture source')
  //   expect(pictureImage.attributes().src).toBe(mockShow.picture.urlMobileSized)
  //   expect(pictureImage.attributes().alt).toBe(mockShow.name)
  //   expect(pictureSource.attributes().srcset).toBe(
  //     mockShow.picture.urlDesktopSized
  //   )
  // })
  test('Should have proper introduction', () => {
    const introduction = wrapper.get('.normal-show__introduction')
    expect(introduction.text()).toContain(mockShow.introduction)
  })
  test('Should have facebook page plugin', () => {
    expect(wrapper.findComponent(FacebookPagePlugin).exists()).toBe(true)
  })
})
