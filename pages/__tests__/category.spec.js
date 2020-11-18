import page from '../category/_slug.vue'
import ArticleCard from '../../components/ArticleCard'
import ArticleCardFeatured from '../../components/ArticleCardFeatured'
import ButtonLoadmore from '../../components/ButtonLoadmore'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const $ga = {
  event: jest.fn(),
}

const $apollo = {
  queries: {
    allPostsCategory: {
      fetchMore: jest.fn(),
    },
  },
}

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        keyword: 'MMTV',
      },
    },
    $apollo,
    $ga,
  },
})

describe('items', () => {
  const wrapper = createWrapper(page, {
    data() {
      return {
        allCategories: [],
        allPostsCategory: [{}, {}],
      }
    },
  })
  test('should call $ga when click featured item', () => {
    const itemFeatured = wrapper.findComponent(ArticleCardFeatured)
    itemFeatured.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'category',
      eventAction: 'click',
      eventLabel: 'category latest',
    })
  })
  test('should call $ga when click item', () => {
    const item = wrapper.findComponent(ArticleCard)
    item.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'category',
      eventAction: 'click',
      eventLabel: 'category latest',
    })
  })
})

describe('load more', () => {
  test('should call $ga when click load more button', async () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          page: 1,
          allCategories: [],
          allPostsCategoryMeta: {
            count: 30,
          },
        }
      },
    })
    const loadMore = wrapper.findComponent(ButtonLoadmore)
    await loadMore.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'category',
      eventAction: 'click',
      eventLabel: 'more',
    })
  })
})
