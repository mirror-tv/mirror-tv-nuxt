import axios from 'axios'
import page from '../search/_keyword.vue'
import ArticleCard from '../../components/ArticleCard'
import ButtonLoadmore from '../../components/ButtonLoadmore'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

jest.mock('axios')

const $ga = {
  event: jest.fn(),
}

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        keyword: 'MMTV',
      },
    },
    $ga,
  },
})

describe('items', () => {
  test('should call $ga when click item', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          listData: [{ articleTitle: '1' }],
        }
      },
    })
    const item = wrapper.findComponent(ArticleCard)
    item.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'search',
      eventAction: 'click',
      eventLabel: 'related articles',
    })
  })
})

describe('load more', () => {
  test('should call $ga when click load more button', async () => {
    axios.mockReturnValue(Promise.resolve())
    const wrapper = createWrapper(page, {
      data() {
        return {
          listData: [],
          listDataCurrentPage: 1,
          listDataMaxResults: 12,
          listDataTotal: 20,
        }
      },
    })
    const loadMore = wrapper.findComponent(ButtonLoadmore)
    await loadMore.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'search',
      eventAction: 'click',
      eventLabel: 'more',
    })
  })
})
