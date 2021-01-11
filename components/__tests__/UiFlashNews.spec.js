import flushPromises from 'flush-promises'

import UiFlashNews from '../UiFlashNews.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const article1Mock = {
  slug: 'test-slug-1',
  name: 'test title1',
}
const article2Mock = {
  slug: 'test-slug-2',
  name: 'test title2',
}
const article3Mock = {
  slug: 'test-slug-3',
  name: 'test title3',
}

const createWrapper = createWrapperHelper({
  propsData: {
    articles: [article1Mock, article2Mock, article3Mock],
  },
})

test('display articles', () => {
  /* Arrange */
  const sut = createWrapper(UiFlashNews)

  /* Assert */
  const links = sut.findAll('a')

  expect(links.at(0).attributes().href).toBe(`/story/${article3Mock.slug}`)
  expect(links.at(1).attributes().href).toBe(`/story/${article1Mock.slug}`)
  expect(links.at(2).attributes().href).toBe(`/story/${article2Mock.slug}`)

  const sutText = sut.text()

  expect(sutText).toContain(article1Mock.name)
  expect(sutText).toContain(article2Mock.name)
  expect(sutText).toContain(article3Mock.name)
})

test('show a next artcile when users click the next arrow', async () => {
  expect.assertions(4)

  /* Arrange */
  const sut = createWrapper(UiFlashNews)

  /* Act */
  sut.get('.next').trigger('click')
  sut.get('.next').trigger('click')
  sut.get('.titles').trigger('transitionend')

  /* Assert */
  await flushPromises()

  const links = sut.findAll('a')

  expect(links.at(0).text()).toBe(article1Mock.name)
  expect(links.at(1).text()).toBe(article2Mock.name)
  expect(links.at(2).text()).toBe(article3Mock.name)

  expect(sut.get('.titles').attributes().style).toContain(
    'transform: translateY(-100%)'
  )
})

test('show a previous artcile when users click the previous arrow', async () => {
  expect.assertions(4)

  /* Arrange */
  const sut = createWrapper(UiFlashNews)

  /* Act */
  sut.get('.prev').trigger('click')
  sut.get('.prev').trigger('click')
  sut.get('.titles').trigger('transitionend')

  /* Assert */
  await flushPromises()

  const links = sut.findAll('a')

  expect(links.at(0).text()).toBe(article2Mock.name)
  expect(links.at(1).text()).toBe(article3Mock.name)
  expect(links.at(2).text()).toBe(article1Mock.name)

  expect(sut.get('.titles').attributes().style).toContain(
    'transform: translateY(-100%)'
  )
})

test('show a next article automatically', () => {
  /* Arrange */
  jest.useFakeTimers()

  createWrapper(UiFlashNews)

  /* Assert */
  expect(setTimeout).toBeCalledTimes(1)
})

test('stop showing a next article automatically when users click the next or previous arrow, and continue to show a next article automatically when a next or previous article is shown', () => {
  jest.useFakeTimers()

  const sut = createWrapper(UiFlashNews)

  sut.get('.next').trigger('click')
  expect(clearTimeout).toBeCalledTimes(1)

  sut.get('.titles').trigger('transitionend')
  expect(setTimeout).toBeCalledTimes(2)

  sut.get('.prev').trigger('click')
  expect(clearTimeout).toBeCalledTimes(2)

  sut.get('.titles').trigger('transitionend')
  expect(setTimeout).toBeCalledTimes(3)
})
