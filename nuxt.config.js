module.exports = {
  telemetry: false,
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'zh-Hant',
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/css/base.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vuePluginsGlobal.js'],
  /*
   ** Nuxt.js Server Middleware
   */
  serverMiddleware: ['~/server-middleware/headers.js'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-analytics',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo',
  ],
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'http://localhost:3000/api/graphql',
        browserHttpEndpoint: '/api/graphql',
      },
    },
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true, // to prevent CORS
  },
  googleAnalytics: {
    id: () => {
      return document.domain.match(/^(www|nuxt).mnews.tw/gs)
        ? 'UA-83609754-1'
        : 'UA-83609754-2'
    },
  },
  styleResources: {
    scss: '~/scss/*.scss',
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}
