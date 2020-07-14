import { shallowMount } from '@vue/test-utils'
import ArticleCardArrowBar from '../ArticleCardArrowBar'

describe('props', function() {
  test('Should render text by "barTitle" props', function() {
    const barTitleMock = 'barTitleMock'
    const wrapper = shallowMount(ArticleCardArrowBar, {
      propsData: {
        barTitle: barTitleMock
      }
    })
    const barTitle = wrapper.find('.bar-title')
    expect(barTitle.text()).toBe(barTitleMock)
  })

  test('Should render text by "articleImgURL" props', async function() {
    expect.assertions(1)
    const articleImgURLMock = 'articleImgURLMock'
    const wrapper = await shallowMount(ArticleCardArrowBar, {
      propsData: {
        articleImgURL: articleImgURLMock
      }
    })
    const articleImg = wrapper.find('.article-img')
    expect(articleImg.attributes()['data-src']).toBe(articleImgURLMock)
  })

  test('Should render text by "articleTitle" props', function() {
    const articleTitleMock = 'articleTitleMock'
    const wrapper = shallowMount(ArticleCardArrowBar, {
      propsData: {
        articleTitle: articleTitleMock
      }
    })
    const articleTitle = wrapper.find('.article-title')
    expect(articleTitle.text()).toBe(articleTitleMock)
  })

  test('Should render text by "articleDate" props', function() {
    const articleDateMockString = '2020/01/02 03:04'
    const articleDateMock = new Date(2020, 0, 2, 3, 4)
    const wrapper = shallowMount(ArticleCardArrowBar, {
      propsData: {
        articleDate: articleDateMock
      }
    })
    const articleDate = wrapper.find('.article-date')
    expect(articleDate.text()).toBe(articleDateMockString)
  })

  test('Should render href by "href" props', function() {
    const hrefMock = 'https://www.google.com'
    const wrapper = shallowMount(ArticleCardArrowBar, {
      propsData: {
        href: hrefMock
      }
    })
    expect(wrapper.attributes().href).toBe(hrefMock)
  })
})

test('snapshot test', async function() {
  const wrapper = await shallowMount(ArticleCardArrowBar, {
    propsData: {
      href: 'https://www.mirrormedia.mg/story/20200715edi026/',
      barTitle: '生活',
      articleImgURL:
        'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
      articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
      articleDate: new Date(2020, 0, 2, 3, 4, 5)
    }
  })
  expect(wrapper.element).toMatchSnapshot()
})
