import { shallowMount } from '@vue/test-utils'
import ArticleCardAside from '../ArticleCardAside'

describe('props', function () {
  test('Should render image src by "articleImgURL" props', async function () {
    expect.assertions(1)
    const articleImgURLMock = 'articleImgURLMock'
    const wrapper = await shallowMount(ArticleCardAside, {
      propsData: {
        articleImgURL: articleImgURLMock,
      },
    })
    const articleImg = wrapper.find('.article-img')
    expect(articleImg.attributes()['data-src']).toBe(articleImgURLMock)
  })

  test('Should render text by "articleTitle" props', function () {
    const articleTitleMock = 'articleTitleMock'
    const wrapper = shallowMount(ArticleCardAside, {
      propsData: {
        articleTitle: articleTitleMock,
      },
    })
    const articleTitle = wrapper.find('.article-title')
    expect(articleTitle.text()).toBe(articleTitleMock)
  })

  test('Should render href by "href" props', function () {
    const hrefMock = 'https://www.google.com'
    const wrapper = shallowMount(ArticleCardAside, {
      propsData: {
        href: hrefMock,
      },
    })
    expect(wrapper.attributes().href).toBe(hrefMock)
  })
})
