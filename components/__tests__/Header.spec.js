import { RouterLinkStub } from '@vue/test-utils'
import Header from '../Header.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      state: {
        categories: ['']
      }
    }
  },
  stubs: {
    'nuxt-link': RouterLinkStub
  }
})
describe('Features about the top of the header', function() {
  test('Navigate to home page while logo was clicked', function() {
    const wrapper = createWrapper(Header)
    const logo = wrapper.find('.logo')
    expect(logo.props().to).toBe('/')
  })

  test('Should have class "rotated" after we click hamburger icon', async function() {
    expect.assertions(2)
    const wrapper = createWrapper(Header)
    const hamburger = wrapper.find('.hamburger-button')
    hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(hamburger.classes()).toContain('hamburger-button--rotated')
    hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(hamburger.classes()).not.toContain('hamburger-button--rotated')
  })
})

describe('Features about the bottom of the header', function() {
  test('Should render proper navs with category data', function() {
    const mockCategories = ['one', 'two', 'three']
    const wrapper = createWrapper(Header, {
      mocks: {
        $store: {
          state: {
            categories: mockCategories
          }
        }
      }
    })
    const navs = wrapper.findAll('.category-nav')
    mockCategories.forEach(function assertTextContent(categoryTitle, i) {
      const nav = navs.at(i)
      expect(nav.text()).toBe(categoryTitle)
      expect(nav.find(RouterLinkStub).props().to).toBe(
        `/category/${categoryTitle}`
      )
    })
  })

  test('Should truncate textContent in nav if more than five character', function() {
    const mockCategories = ['123456789moreThanfiveCharacter']
    const wrapper = createWrapper(Header, {
      mocks: {
        $store: {
          state: {
            categories: mockCategories
          }
        }
      }
    })
    const nav = wrapper.find('.category-nav')
    expect(nav.text()).toBe('12345')
    expect(nav.text()).not.toBe(mockCategories[0])
  })
})
