import { shallowMount } from '@vue/test-utils'
import ArticleTag from '../ArticleTag.vue'

test('Should render props href', function() {
  const tagMock = {
    name: 'test'
  }
  const wrapper = shallowMount(ArticleTag, {
    propsData: {
      tag: tagMock
    }
  })
  expect(wrapper.text()).toBe(tagMock.name)
})
