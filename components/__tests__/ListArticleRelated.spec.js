import { shallowMount } from '@vue/test-utils'
import ArticleCardOnlyTitle from '~/components/ArticleCardOnlyTitle'
import HeadingBordered from '~/components/HeadingBordered'
import ListArticleRelated from '~/components/ListArticleRelated'

describe('listTitle', function () {
  test('Should render proper listTitle', function () {
    const wrapper = shallowMount(ListArticleRelated, {
      propsData: {
        listData: [{ name: '', slug: '' }],
      },
    })
    const title = wrapper.findComponent(HeadingBordered)
    expect(title.props().text).toBe('相關文章')
  })
})

describe('props', function () {
  test('Should render ArticleCardOnlyTitle within list items by "listData" props', function () {
    const listDataMock = [
      {
        slug: 'abc',
        name: 'title',
        state: 'published',
      },
    ]
    const wrapper = shallowMount(ListArticleRelated, {
      propsData: {
        listData: listDataMock,
      },
    })
    const articleCard = wrapper.findComponent(ArticleCardOnlyTitle)
    expect(articleCard.props().href).toBe(`/story/${listDataMock[0].slug}`)
    expect(articleCard.props().articleTitle).toBe(listDataMock[0].name)
  })
})
