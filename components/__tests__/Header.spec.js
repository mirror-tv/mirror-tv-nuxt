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

  test('Should have modifier "rotated" on hamburger icon and not have "hide" on bottom wrapper after we click hamburger icon', async function() {
    expect.assertions(4)
    const wrapper = createWrapper(Header)
    const hamburger = wrapper.find('.hamburger-button')
    const headerBottomWrapper = wrapper.find('.header__bottom-wrapper')
    hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(hamburger.classes()).toContain('hamburger-button--rotated')
    expect(headerBottomWrapper.classes()).not.toContain(
      'header__bottom-wrapper--hide'
    )
    hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(hamburger.classes()).not.toContain('hamburger-button--rotated')
    expect(headerBottomWrapper.classes()).toContain(
      'header__bottom-wrapper--hide'
    )
  })

  test('Should have modifier "visible" on HeaderSearchForm in mobile after we click search icon', async function() {
    const wrapper = createWrapper(Header)
    const searchIcon = wrapper.find('.search-button')
    const searchFormWrapperMobile = wrapper.find('.search-form-wrapper-mobile')
    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchFormWrapperMobile.classes()).toContain(
      'search-form-wrapper-mobile--visible'
    )
    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchFormWrapperMobile.classes()).not.toContain(
      'search-form-wrapper-mobile--visible'
    )
  })

  test('Should hide bottom wrapper if search form wrapper was shown, vice versa', async function() {
    const wrapper = createWrapper(Header)

    // buttons
    const hamburger = wrapper.find('.hamburger-button')
    const searchIcon = wrapper.find('.search-button')
    // wrappers
    const headerBottomWrapper = wrapper.find('.header__bottom-wrapper')
    const searchFormWrapperMobile = wrapper.find('.search-form-wrapper-mobile')

    hamburger.trigger('click')
    await wrapper.vm.$nextTick()

    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(headerBottomWrapper.classes()).toContain(
      'header__bottom-wrapper--hide'
    )

    hamburger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchFormWrapperMobile.classes()).not.toContain(
      'search-form-wrapper-mobile--visible'
    )
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
