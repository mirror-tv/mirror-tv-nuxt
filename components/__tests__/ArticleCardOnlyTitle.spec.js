import { shallowMount } from '@vue/test-utils'
import ArticleCardOnlyTitle from '../ArticleCardOnlyTitle'

describe('props', function() {
  test('Should render text and href by "articleTitle" and "href" props', function() {
    const articleTitleMock = 'articleTitleMock'
    const hrefMock = 'https://www.google.com'
    const wrapper = shallowMount(ArticleCardOnlyTitle, {
      propsData: {
        articleTitle: articleTitleMock,
        href: hrefMock
      }
    })
    expect(wrapper.text()).toBe(articleTitleMock)
    expect(wrapper.attributes().href).toBe(hrefMock)
  })
})
