import page from '../tag/_name.vue'
// import ArticleCard from '../../components/ArticleCard'
import ButtonLoadmore from '../../components/ButtonLoadmore'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const routeName = 'MMTV'

const $ga = {
  event: jest.fn(),
}

const $apollo = {
  queries: {
    posts: {
      fetchMore: jest.fn(),
    },
  },
}

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        name: routeName,
      },
    },
    $apollo,
    $ga,
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

// describe('items', () => {
//   const items = [
//     {
//       slug: '1',
//     },
//     {
//       slug: '2',
//     },
//   ]
//   const wrapper = createWrapper(page, {
//     data() {
//       return {
//         posts: items,
//       }
//     },
//   })
//   test('ArticleCard should have correct amount', () => {
//     expect(wrapper.findAllComponents(ArticleCard)).toHaveLength(items.length)
//   })
//   test('should call $ga when click item', () => {
//     const item = wrapper.findComponent(ArticleCard)
//     item.trigger('click')
//     expect($ga.event).toBeCalledWith({
//       eventCategory: 'tag',
//       eventAction: 'click',
//       eventLabel: 'article',
//     })
//   })
// })

describe('load more', () => {
  test('should have button to load more when number of posts is not all', () => {
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
  test('should not have button to load more when number of posts is equal to postsCount', () => {
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
  test('should call $apollo fetchMore when click load more button', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          posts: [],
          postsCount: 20,
        }
      },
    })
    const loadMore = wrapper.findComponent(ButtonLoadmore)
    loadMore.trigger('click')
    expect($apollo.queries.posts.fetchMore).toBeCalled()
  })
  test('should call $ga when click load more button', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          posts: [],
          postsCount: 20,
        }
      },
    })
    const loadMore = wrapper.findComponent(ButtonLoadmore)
    loadMore.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'tag',
      eventAction: 'click',
      eventLabel: 'more',
    })
  })
})
