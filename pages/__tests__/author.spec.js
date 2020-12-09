import page from '../author/_slug.vue'
import ArticleCardWithCategory from '../../components/ArticleCardWithCategory'
import ContactBlock from '../../components/ContactBlock'
import FacebookPagePlugin from '../../components/FacebookPagePlugin'
import ListArticleAside from '../../components/ListArticleAside'

import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const $apollo = {
  queries: {
    posts: {
      fetchMore: jest.fn(),
    },
  },
  addSmartQuery: jest.fn(),
}

const $ga = {
  event: jest.fn(),
}

const contact = {
  name: 'test',
  image: {
    urlMobileSized: 'https://image.com',
  },
  facebook: 'https://facebook.com',
  instatgram: 'https://instatgram.com',
  bio: 'test profile',
}

const createWrapper = createWrapperHelper({
  mocks: {
    $route: {
      params: {
        slug: 'test',
      },
    },
    $apollo,
    $ga,
  },
  data() {
    return {
      contact,
      posts: [],
    }
  },
})

describe('contact information', () => {
  test('Should have ContactBlock', () => {
    const wrapper = createWrapper(page)
    const contactBlock = wrapper.findComponent(ContactBlock)
    expect(contactBlock.exists()).toBe(true)
  })
  test('Should have proper props', () => {
    const wrapper = createWrapper(page)
    const contactBlock = wrapper.findComponent(ContactBlock)
    expect(contactBlock.props().name).toBe(contact.name)
    expect(contactBlock.props().image).toBe(contact.image.urlMobileSized)
    expect(contactBlock.props().facebook).toBe(contact.facebook)
    expect(contactBlock.props().instatgram).toBe(contact.instatgram)
    expect(contactBlock.props().profile).toBe(contact.bio)
  })
})

describe('posts count', () => {
  test('Should render posts count', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.html()).toContain('所有文章（0）')
  })
})

describe('posts', () => {
  const items = [{ slug: 'test' }]
  const wrapper = createWrapper(page, {
    data() {
      return {
        contact,
        posts: items,
      }
    },
  })
  test('ArticleCardWithCategory should have correct amount', () => {
    expect(wrapper.findAllComponents(ArticleCardWithCategory)).toHaveLength(
      items.length
    )
  })
  test('should call $ga when click item', () => {
    const item = wrapper.findComponent(ArticleCardWithCategory)
    item.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'author',
      eventAction: 'click',
      eventLabel: 'author’s article',
    })
  })
})

describe('load more', () => {
  const wrapper = createWrapper(page, {
    data() {
      return {
        contact,
        posts: [],
        postsCount: 10,
      }
    },
  })
  const loadMoreBtn = wrapper.find('button')
  test('Should render load more button', () => {
    expect(loadMoreBtn.text()).toBe('點我看更多')
  })
  test('Should call $apollo fetchMore and $ga when click load more button', async () => {
    await loadMoreBtn.trigger('click')
    expect($apollo.queries.posts.fetchMore).toBeCalled()
    expect($ga.event).toBeCalledWith({
      eventCategory: 'author',
      eventAction: 'click',
      eventLabel: 'more',
    })
  })
})

describe('latest posts', () => {
  test('Should have ListArticleAside component', () => {
    const wrapper = createWrapper(page, {
      data() {
        return {
          contact,
          posts: [],
          postsCount: 10,
          latestPosts: [{ href: 'xxx' }],
        }
      },
    })
    expect(wrapper.findComponent(ListArticleAside).exists()).toBe(true)
  })
})

describe('facebook page plugin', () => {
  test('Should have FacebookPagePlugin component', () => {
    const wrapper = createWrapper(page)
    expect(wrapper.findComponent(FacebookPagePlugin).exists()).toBe(true)
  })
})
