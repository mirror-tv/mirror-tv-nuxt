import page from '../tag/_name.vue'
import ArticleCard from '../../components/ArticleCard'
import ButtonLoadmore from '../../components/ButtonLoadmore'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const routeName = 'MMTV'
const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        name: routeName,
      },
    },
  },
  data() {
    return {
      posts: [],
    }
  },
})

describe('route params name', () => {
  test('should use route params name as heading', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.html()).toContain(routeName)
  })
})

describe('items', () => {
  test('ArticleCard should have correct amount', () => {
    const items = [
      {
        slug: '1',
      },
      {
        slug: '2',
      },
    ]
    const wrapper = createWrapper(page, {
      data() {
        return {
          posts: items,
        }
      },
    })
    expect(wrapper.findAllComponents(ArticleCard)).toHaveLength(items.length)
  })
})

describe('load more', () => {
  test('should have buttoon to load more when number of posts is not all', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          posts: [],
          postsCount: 20,
        }
      },
    })
    expect(wrapper.findComponent(ButtonLoadmore).exists()).toBe(true)
  })
  test('should not have buttoon to load more when number of posts is equal to postsCount', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          posts: [{}],
          postsCount: 1,
        }
      },
    })
    expect(wrapper.findComponent(ButtonLoadmore).exists()).toBe(false)
  })
})
