import { shallowMount } from '@vue/test-utils'
import ArticleCredit from '../ArticleCredit.vue'

describe('contacts props is not otherbyline', function () {
  test('Should render props single credit', function () {
    const contactsMock = [{ name: 'test' }]
    const wrapper = shallowMount(ArticleCredit, {
      propsData: {
        contactType: 'writers',
        contacts: contactsMock,
      },
    })
    expect(wrapper.text()).toBe(`作者｜${contactsMock[0].name}`)
  })

  test('Should render props multiple credits', function () {
    const contactsMock = [{ name: 'test' }, { name: 'test1' }]
    const wrapper = shallowMount(ArticleCredit, {
      propsData: {
        contactType: 'photographers',
        contacts: contactsMock,
      },
    })
    expect(wrapper.text()).toBe(
      `攝影｜${contactsMock[0].name}、${contactsMock[1].name}`
    )
  })
})

describe('contacts props is otherbyline', function () {
  test('Should render props credit', function () {
    const contactsMock = 'test'
    const wrapper = shallowMount(ArticleCredit, {
      propsData: {
        contacts: contactsMock,
      },
    })
    expect(wrapper.text()).toBe(contactsMock)
  })
})
