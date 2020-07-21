import { shallowMount } from '@vue/test-utils'
import ArticleCard from '../ArticleCard'

describe('props', function() {
  test('Should hide .label-title-wrapper if we did not provide "labelTitle" props', function() {
    const wrapper = shallowMount(ArticleCard)
    const labelTitleWrapper = wrapper.find('.label-title-wrapper')
    expect(labelTitleWrapper.exists()).toBe(false)
  })

  test('Should render text by "labelTitle" props', function() {
    const labelTitleMock = 'labelTitleMock'
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        labelTitle: labelTitleMock
      }
    })
    const barTitle = wrapper.find('.label-title')
    expect(barTitle.text()).toBe(labelTitleMock)
  })

  test('Should render image src by "articleImgURL" props', async function() {
    expect.assertions(1)
    const articleImgURLMock = 'articleImgURLMock'
    const wrapper = await shallowMount(ArticleCard, {
      propsData: {
        articleImgURL: articleImgURLMock
      }
    })
    const articleImg = wrapper.find('.article-img')
    expect(articleImg.attributes()['data-src']).toBe(articleImgURLMock)
  })

  test('Should render text by "articleTitle" props', function() {
    const articleTitleMock = 'articleTitleMock'
    const wrapper = shallowMount(ArticleCard, {
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
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        articleDate: articleDateMock
      }
    })
    const articleDate = wrapper.find('.article-date')
    expect(articleDate.text()).toBe(articleDateMockString)
  })

  test('Should render href by "href" props', function() {
    const hrefMock = 'https://www.google.com'
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        href: hrefMock
      }
    })
    expect(wrapper.attributes().href).toBe(hrefMock)
  })

  test('Should have class "row-mobile" on .bottom-wrapper if we did not provide "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard)
    const bottomWrapper = wrapper.find('.bottom-wrapper')
    expect(bottomWrapper.classes()).toContain('row-mobile')
  })

  test('Should have class "shrink" on .article-img if we did not provide "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard)
    const articleImage = wrapper.find('.article-img')
    expect(articleImage.classes()).toContain('shrink')
  })

  test('Should have modifier "margin-left" on .bottom-wrapper__info-wrapper if we did not provide "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard)
    const infoWrapper = wrapper.find('.bottom-wrapper__info-wrapper')
    expect(infoWrapper.classes()).toContain(
      'bottom-wrapper__info-wrapper--margin-left'
    )
  })

  test('Should have class "column-mobile" on .bottom-wrapper if we provide "column" to "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        mobileLayoutDirection: 'column'
      }
    })
    const bottomWrapper = wrapper.find('.bottom-wrapper')
    expect(bottomWrapper.classes()).toContain('column-mobile')
  })

  test('Should have class "stretch" on .article-img if we provide "column" to "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        mobileLayoutDirection: 'column'
      }
    })
    const articleImage = wrapper.find('.article-img')
    expect(articleImage.classes()).toContain('stretch')
  })

  test('Should have modifier "margin-right" on .bottom-wrapper__info-wrapper if we provide "column" to "mobileLayoutDirection" props', function() {
    const wrapper = shallowMount(ArticleCard, {
      propsData: {
        mobileLayoutDirection: 'column'
      }
    })
    const infoWrapper = wrapper.find('.bottom-wrapper__info-wrapper')
    expect(infoWrapper.classes()).toContain(
      'bottom-wrapper__info-wrapper--margin-right'
    )
  })
})

describe('snapshot tests', function() {
  test('Usage with provided labelTitle', async function() {
    const wrapper = await shallowMount(ArticleCard, {
      propsData: {
        href: 'https://www.mirrormedia.mg/story/20200715edi026/',
        labelTitle: '生活',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
        articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
        articleDate: new Date(2020, 0, 2, 3, 4, 5)
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Usage with not provided labelTitle', async function() {
    const wrapper = await shallowMount(ArticleCard, {
      propsData: {
        href: 'https://www.mirrormedia.mg/story/20200715edi026/',
        // labelTitle: '生活',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
        articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
        articleDate: new Date(2020, 0, 2, 3, 4, 5)
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Usage with provided mobileLayoutDirection', async function() {
    const wrapper = await shallowMount(ArticleCard, {
      propsData: {
        href: 'https://www.mirrormedia.mg/story/20200715edi026/',
        labelTitle: '生活',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
        articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
        articleDate: new Date(2020, 0, 2, 3, 4, 5),
        mobileLayoutDirection: 'column'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
