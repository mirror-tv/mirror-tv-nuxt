import styleVariables from '~/scss/_variables.scss'

const {
  'breakpoint-md': breakpointMd,
  'breakpoint-xl': breakpointXl,
  'breakpoint-xxl': breakpointXxl,
} = styleVariables

const state = () => ({
  width: 0,
  height: 0,
})

const getters = {
  isViewportWidthUpMd(state) {
    return state.width >= parseInt(breakpointMd, 10)
  },
  isViewportWidthUpXl(state) {
    return state.width >= parseInt(breakpointXl, 10)
  },
  isViewportWidthUpXxl(state) {
    return state.width >= parseInt(breakpointXxl, 10)
  },
}

const mutations = {
  setViewport(state, viewport = {}) {
    ;({ width: state.width, height: state.height } = viewport)
  },
}

export { state, getters, mutations }
