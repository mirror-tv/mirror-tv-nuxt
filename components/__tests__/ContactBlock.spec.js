import ContactBlock from '../ContactBlock.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('props', () => {
  const name = 'test'
  test('should render props image', () => {
    const mockImage = 'xxx.png'
    const wrapper = createWrapper(ContactBlock, {
      propsData: {
        image: mockImage,
        name,
      },
    })
    const image = wrapper.find('img')
    expect(image.attributes().src).toBe(mockImage)
    expect(image.attributes().alt).toBe(name)
  })
  test('should render props name', () => {
    const wrapper = createWrapper(ContactBlock, {
      propsData: {
        name,
      },
    })
    expect(wrapper.find('h1').text()).toBe(name)
  })
  test('should render props profile', () => {
    const profile = '測試文字'
    const wrapper = createWrapper(ContactBlock, {
      propsData: {
        profile,
      },
    })
    expect(wrapper.html()).toContain(profile)
  })
  test('should render props facebook', () => {
    const facebook = 'https://xxx.xxx.xx'
    const wrapper = createWrapper(ContactBlock, {
      propsData: {
        facebook,
      },
    })
    expect(wrapper.find('a').attributes().href).toBe(facebook)
    expect(wrapper.find('a img').attributes().src).toBe(
      '~/assets/img/facebook-logo-grey-58.png'
    )
  })
  test('should render props instagram', () => {
    const instagram = 'https://xxx.xxx.xx'
    const wrapper = createWrapper(ContactBlock, {
      propsData: {
        instagram,
      },
    })
    expect(wrapper.find('a').attributes().href).toBe(instagram)
    expect(wrapper.find('a img').attributes().src).toBe(
      '~/assets/img/IG-logo.svg'
    )
  })
})
