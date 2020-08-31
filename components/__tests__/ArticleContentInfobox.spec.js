import { shallowMount } from '@vue/test-utils'
import ArticleContentInfobox from '../ArticleContentInfobox.vue'

test('Should render proper infobox from props', function() {
  const titleMock = 'title'
  const bodyMock = '<p>content</p>'
  const wrapper = shallowMount(ArticleContentInfobox, {
    propsData: {
      infobox: {
        title: titleMock,
        body: bodyMock
      }
    }
  })
  const infoboxTitle = wrapper.get('.infobox h3')
  expect(infoboxTitle.text()).toBe(titleMock)
  const infoboxBody = wrapper.get('.infobox > div')
  expect(infoboxBody.html()).toContain(bodyMock)
})
