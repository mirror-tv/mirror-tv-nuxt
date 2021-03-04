import { shallowMount } from '@vue/test-utils'
import ArticleCardOnlyTitle from '~/components/ArticleCardOnlyTitle'
import ListArticleRelated from '~/components/ListArticleRelated'

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
