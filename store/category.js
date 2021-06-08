import _ from 'lodash'

export const state = () => ({
  data: {},
})

export const getters = {
  categories(state) {
    return state.data.allCategories ?? []
  },
  shows(state) {
    return state.data.allShows ?? []
  },
  posts(state) {
    return state.data.allPosts ?? []
  },
  displayedCategories(state, getters) {
    const data = getters.categories.filter((item) => item.isFeatured) ?? []
    const sortedData = data ? sortCategories(data) : []
    return sortedData
  },
  displayedShows(state, getters) {
    return getters.shows ? sortShows(getters.shows) : []
  },
  displayedTopPosts(state, getters) {
    return groupPostByCategory(getters.posts)
  },
}

export const mutations = {
  setHeaderData(state, data) {
    state.data = data
  },
}

export const actions = {
  async fetchHeaderData() {
    const response = await this.$fetchHeaderRawData()
    return response
  },
}

function sortCategories(data) {
  return _.sortBy(data, 'sortOrder')
}

function sortShows(data) {
  return _.sortBy(data, ['sortOrder', 'updatedAt'], ['asc', 'desc'])
}

function groupPostByCategory(data) {
  return _.groupBy(data, 'categories[0][name]')
}
