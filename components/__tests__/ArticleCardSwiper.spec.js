import { mount } from '@vue/test-utils'
import ArticleCardSwiper from '~/components/ArticleCardSwiper'

describe('props', function () {
  test('Should render href by "href" props', function () {
    const hrefMock = 'https://www.google.com'
    const wrapper = mount(ArticleCardSwiper, {
      propsData: {
        href: hrefMock,
      },
    })
    expect(wrapper.props().href).toBe(hrefMock)
  })

  test('Should render image src by "articleImgURL" props', async function () {
    expect.assertions(1)
    const articleImgURLMock = 'articleImgURLMock'
    const wrapper = await mount(ArticleCardSwiper, {
      propsData: {
        articleImgURL: articleImgURLMock,
      },
    })
    const articleImg = wrapper.find('.article-img')
    expect(articleImg.attributes().src).toBe(articleImgURLMock)
  })

  test('Should render text by "articleTitle" props', function () {
    const articleTitleMock = 'articleTitleMock'
    const wrapper = mount(ArticleCardSwiper, {
      propsData: {
        articleTitle: articleTitleMock,
      },
    })
    const articleTitle = wrapper.find('.article-title')
    expect(articleTitle.text()).toBe(articleTitleMock)
  })
})
