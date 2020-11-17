import page from '../tag/_name.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper()

describe('route params name', () => {
  test('should use route params name as heading', () => {
    const routeName = 'MMTV'
    const wrapper = createWrapper(page, {
      mocks: {
        $route: {
          params: {
            name: routeName,
          },
        },
      },
    })
    expect(wrapper.html()).toContain(routeName)
  })
})
