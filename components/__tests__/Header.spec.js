import { RouterLinkStub } from '@vue/test-utils'
import Header from '../Header.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const $ga = {
  event: jest.fn(),
}

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      state: {
        categories: [''],
      },
    },
    $route: {
      name: '',
      params: {
        keyword: '',
      },
    },
    $ga,
  },
  stubs: {
    'nuxt-link': RouterLinkStub,
  },
  data() {
    return {
      allCategories: [{ name: 'title', slug: 'slug' }],
    }
  },
})

describe('Features about the top of the header', function () {
  // test('Navigate to home page while logo was clicked', function () {
  //   const wrapper = createWrapper(Header)
  //   const logo = wrapper.find('.logo')
  //   expect(logo.props().to).toBe('/')
  // })

  test('Should have modifier "rotated" on hamburger icon and not have "hide" on bottom wrapper after we click hamburger icon', async function () {
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

  test('Should have modifier "visible" on HeaderSearchForm in mobile after we click search icon', async function () {
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

  test('Should have modifier "translucent" on search button in mobile after we click search icon', async () => {
    const wrapper = createWrapper(Header)
    const searchIcon = wrapper.find('.search-button')
    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchIcon.classes()).toContain('search-button--translucent')
    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchIcon.classes()).not.toContain('search-button--translucent')
  })

  test('Should hide bottom wrapper if search form wrapper was shown, vice versa', async function () {
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

  // test('Should hide bottom wrapper after category link was clicked', async function () {
  //   expect.assertions(2)
  //   const wrapper = createWrapper(Header)

  //   const hamburger = wrapper.find('.hamburger-button')
  //   hamburger.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   const headerBottomWrapper = wrapper.find('.header__bottom-wrapper')
  //   expect(headerBottomWrapper.classes()).not.toContain(
  //     'header__bottom-wrapper--hide'
  //   )

  //   const link = wrapper.find('.category-nav').find(RouterLinkStub)
  //   link.trigger('click')
  //   await wrapper.vm.$nextTick()
  //   expect(headerBottomWrapper.classes()).toContain(
  //     'header__bottom-wrapper--hide'
  //   )
  // })

  test('Should hide search form wrapper after we click the dimmed background', async function () {
    expect.assertions(2)

    const wrapper = createWrapper(Header)
    const searchIcon = wrapper.find('.search-button')
    const searchFormWrapperMobile = wrapper.find('.search-form-wrapper-mobile')
    searchIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchFormWrapperMobile.classes()).toContain(
      'search-form-wrapper-mobile--visible'
    )
    const dimmedBackground = wrapper.find(
      '.search-form-wrapper-mobile__dimmed-background'
    )
    dimmedBackground.trigger('click')
    await wrapper.vm.$nextTick()
    expect(searchFormWrapperMobile.classes()).not.toContain(
      'search-form-wrapper-mobile--visible'
    )
  })
})

// describe('Features about the bottom of the header', function () {
//   test('Should render proper navs with category data', function () {
//     const mockCategories = [{ name: 'one' }, { name: 'two' }, { name: 'three' }]
//     const wrapper = createWrapper(Header, {
//       data() {
//         return {
//           allCategories: mockCategories,
//         }
//       },
//     })
//     const navs = wrapper.findAll('.category-nav')
//     mockCategories.forEach(function assertTextContent(category, i) {
//       const nav = navs.at(i)
//       expect(nav.text()).toBe(category.name)
//       expect(nav.find(RouterLinkStub).props().to).toBe(
//         `/category/${category.slug}`
//       )
//     })
//   })
// })

// describe('GA', () => {
//   test('should call $ga when click logo', () => {
//     const wrapper = createWrapper(Header)
//     const logo = wrapper.find('.logo')
//     logo.trigger('click')
//     expect($ga.event).toBeCalledWith({
//       eventCategory: 'header',
//       eventAction: 'click',
//       eventLabel: 'mnews logo',
//     })
//   })
// })
