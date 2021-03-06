import { RouterLinkStub } from '@vue/test-utils'
import ListArticleAside from '../ListArticleAside'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import ArticleCardAside from '~/components/ArticleCardAside'
import HeadingBordered from '~/components/HeadingBordered'

const createWrapper = createWrapperHelper({
  propsData: {
    listTitle: 'requiredTitle',
    listData: [
      {
        href: 'https://www.google.com',
        articleImgURL: 'img',
        articleTitle: 'title',
      },
    ],
  },
  stubs: {
    'nuxt-link': RouterLinkStub,
  },
})

describe('props', function () {
  test('Should render text by "listTitle" props', function () {
    const titleMock = 'titleMock'
    const wrapper = createWrapper(ListArticleAside, {
      propsData: {
        listTitle: titleMock,
      },
    })
    const title = wrapper.findComponent(HeadingBordered)
    expect(title.props().text).toBe(titleMock)
  })

  test('Should render ArticleCardAside within list items by "listData" props', function () {
    const listDataMock = [
      {
        href: 'https://www.google.com',
        articleImgURL: 'img',
        articleTitle: 'title',
      },
    ]
    const wrapper = createWrapper(ListArticleAside, {
      propsData: {
        listData: listDataMock,
      },
    })
    const articleCard = wrapper.findComponent(ArticleCardAside)
    expect(articleCard.props().href).toBe(listDataMock[0].href)
    expect(articleCard.props().articleImgURL).toBe(
      listDataMock[0].articleImgURL
    )
    expect(articleCard.props().articleTitle).toBe(listDataMock[0].articleTitle)
  })

  test('Should render proper props on nuxt-link by "moreTo" props', function () {
    const toMock = '/path'
    const wrapper = createWrapper(ListArticleAside, {
      propsData: {
        moreTo: toMock,
      },
    })
    const link = wrapper.find(RouterLinkStub)
    expect(link.props().to).toBe(toMock)
  })

  test('Hide nuxt-link if we do not provide "moreTo" props', function () {
    const wrapper = createWrapper(ListArticleAside)
    const link = wrapper.find(RouterLinkStub)
    expect(link.exists()).toBe(false)
  })
})
