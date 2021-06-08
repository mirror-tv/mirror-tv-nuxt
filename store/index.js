// export const state = () => ({
//   categories: ['時事', '生活', '政治', '娛樂', '旅遊', '文化'],
// })
export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    const headerResponse = await dispatch('fetchGlobalData')
    commitHeaderData(commit, headerResponse)
  },
  async fetchGlobalData({ dispatch }) {
    const headerResponse = await dispatch('category/fetchHeaderData')
    return headerResponse
  },
}

function commitHeaderData(commit, response) {
  commit('category/setHeaderData', response)
}
