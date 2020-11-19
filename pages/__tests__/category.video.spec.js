import { mount } from '@vue/test-utils'

import page from '../category/video.vue'
import ArticleListSlides from '../../components/ArticleListSlides'
import EditorChoices from '../../components/EditorChoices'

const $apollo = {
  addSmartQuery: jest.fn(),
}

const $ga = {
  event: jest.fn(),
}

describe('editor choices', () => {
  const wrapper = mount(page, {
    mocks: {
      $apollo,
      $ga,
    },
    data() {
      return {
        allEditorChoices: [{}, {}],
      }
    },
  })
  test('should call $ga when click item', () => {
    const item = wrapper.findComponent(EditorChoices).find('.item')
    item.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'videonews',
      eventAction: 'click',
      eventLabel: 'editors choice',
    })
  })
})

describe('items by categories', () => {
  const wrapper = mount(page, {
    mocks: {
      $apollo,
      $ga,
    },
    data() {
      return {
        allCategories: [{ slug: 'person' }],
        personPosts: {
          items: [{}, {}, {}, {}, {}],
          total: 20,
        },
      }
    },
  })
  test('should call $ga when click slide item', () => {
    const categoryLink = wrapper.find('.category-posts__link')
    categoryLink.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'videonews',
      eventAction: 'click',
      eventLabel: 'categories page',
    })
  })

  test('should call $ga when click slide item', () => {
    const item = wrapper.findComponent(ArticleListSlides).find('.item')
    item.trigger('click')
    expect($ga.event).toBeCalledWith({
      eventCategory: 'videonews',
      eventAction: 'click',
      eventLabel: 'articles',
    })
  })

  test('should call $ga when click slide button', async () => {
    const rightBtn = wrapper
      .findComponent(ArticleListSlides)
      .find('.slide-btn.next')
    await rightBtn.trigger('click')

    expect($ga.event).toBeCalledWith({
      eventCategory: 'videonews',
      eventAction: 'click',
      eventLabel: 'right button for more articles',
    })

    const leftBtn = wrapper
      .findComponent(ArticleListSlides)
      .find('.slide-btn.prev')
    await leftBtn.trigger('click')

    expect($ga.event).toBeCalledWith({
      eventCategory: 'videonews',
      eventAction: 'click',
      eventLabel: 'left button for more articles',
    })
  })
})
