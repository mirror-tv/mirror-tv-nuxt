import { shallowMount } from '@vue/test-utils'
import ArticleCardFeatured from '../ArticleCardFeatured'

describe('props', function() {
  test('Should render image src by "articleImgURL" props', async function() {
    expect.assertions(1)
    const articleImgURLMock = 'articleImgURLMock'
    const wrapper = await shallowMount(ArticleCardFeatured, {
      propsData: {
        articleImgURL: articleImgURLMock
      }
    })
    const articleImg = wrapper.find('.article-img')
    expect(articleImg.attributes()['data-src']).toBe(articleImgURLMock)
  })

  test('Should render text by "articleTitle" props', function() {
    const articleTitleMock = 'articleTitleMock'
    const wrapper = shallowMount(ArticleCardFeatured, {
      propsData: {
        articleTitle: articleTitleMock
      }
    })
    const articleTitle = wrapper.find('.article-title')
    expect(articleTitle.text()).toBe(articleTitleMock)
  })

  test('Should render text by "articleDate" props', function() {
    const articleDateMockString = '2020/01/02 03:04'
    const articleDateMock = new Date(2020, 0, 2, 3, 4)
    const wrapper = shallowMount(ArticleCardFeatured, {
      propsData: {
        articleDate: articleDateMock
      }
    })
    const articleDate = wrapper.find('.article-date')
    expect(articleDate.text()).toBe(articleDateMockString)
  })

  test('Should render href by "href" props', function() {
    const hrefMock = 'https://www.google.com'
    const wrapper = shallowMount(ArticleCardFeatured, {
      propsData: {
        href: hrefMock
      }
    })
    expect(wrapper.attributes().href).toBe(hrefMock)
  })
})
