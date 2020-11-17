import page from '../tag/_name.vue'
import ArticleCard from '../../components/ArticleCard'

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
})

describe('route params name', () => {
  test('should use route params name as heading', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.html()).toContain(routeName)
  })
})

describe('items', () => {
  test('ArticleCard should have corect amount', () => {
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
