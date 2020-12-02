const { BASE_URL } = require('./configs/config')
const {
  ENABLE_REDIS,
  PREFIX,
  cleanPathQuery,
  redisWriteClient,
} = require('./server-middleware/redis/utils')

const SITE_NAME = '鏡電視'
const SITE_DESCRIPTION =
  '鏡新聞與鏡電視是一個由全方位媒體人用專業跟熱情澆灌出來的新聞平台！'

module.exports = {
  telemetry: false,
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'zh-Hant',
    },
    title: SITE_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: SITE_NAME,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: SITE_DESCRIPTION,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${BASE_URL}/default.jpg`,
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'website',
      },
      {
        hid: 'fb:app_id',
        property: 'fb:app_id',
        content: '',
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
  css: ['~/css/base.css', '~/scss/global.scss'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vuePluginsGlobal.js'],
  /*
   ** Nuxt.js Server Middleware
   */
  serverMiddleware: [
    '~/server-middleware/headers.js',
    '~/server-middleware/redis/index.js',
  ],
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
    ['@nuxtjs/component-cache', { maxAge: 1000 * 60 * 60 * 24 }],
  ],
  hooks: {
    // Doc: https://nuxtjs.org/docs/2.x/internals-glossary/internals-renderer#hooks
    render: {
      routeDone(url, result, context) {
        if (ENABLE_REDIS && !result.error && result && redisWriteClient) {
          try {
            redisWriteClient.set(
              `${PREFIX}${cleanPathQuery(url)}`,
              JSON.stringify(result.html),
              'EX',
              100
            )
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`[REDIS/WRITE]Set Redis Failed. url: ${url}`, error)
          }
        }
      },
    },
  },
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
    scss: ['~/scss/_*.scss'],
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
