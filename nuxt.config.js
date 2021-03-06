const webpack = require('webpack')
const { BASE_URL } = require('./configs/config')
const {
  ENABLE_REDIS,
  PREFIX,
  cleanPathQuery,
  redisClient,
} = require('./server-middleware/redis/utils')
const { ENV = 'dev' } = require('./configs/config')
const GOOGLE_OPT_CONTAINER_ID =
  ENV === 'dev' || ENV === 'local' ? 'OPT-N56G7LW' : 'OPT-M64PDTC'

const SITE_NAME = '鏡新聞'
const SITE_DESCRIPTION =
  '鏡新聞是一個由全方位媒體人用專業跟熱情澆灌出來的新聞平台！'

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
      {
        hid: 'fb:domain_verify',
        name: 'facebook-domain-verification',
        content: '7v0te27og6sce0l7pa5gziy1587j5r',
      },
      { name: 'msapplication-TileColor', content: '#003366' },
      { name: 'theme-color', content: '#ffffff' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/apple-touch-icon.png',
      },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#003366' },
    ],
    script: [
      ...(ENV !== 'lighthouse'
        ? [
            // comScore Tag
            {
              hid: 'comScore',
              innerHTML: `
                var _comscore = _comscore || [];
                _comscore.push({ c1: "2", c2: "35880649" });
                (function() {
                  var s = document.createElement("script"), el = document.getElementsByTagName("script")[0]; s.async = true;
                  s.src = "https://sb.scorecardresearch.com/cs/35880649/beacon.js";
                  el.parentNode.insertBefore(s, el);
                })();
              `,
            },
          ]
        : []),
      {
        hid: 'googleOptimize',
        src: `https://www.googleoptimize.com/optimize.js?id=${GOOGLE_OPT_CONTAINER_ID}`,
      },
      // https://developers.google.com/doubleclick-gpt/guides/general-best-practices#load_statically
      // {
      //   hid: 'gptScript',
      //   src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
      //   async: true,
      // },
      // {
      //   hid: 'adSense',
      //   src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
      //   'data-ad-client': 'ca-pub-6117138886514853',
      //   async: true,
      // },
    ],
    noscript: [
      // comScore Tag
      {
        hid: 'comScoreNoScript',
        innerHTML:
          '<img src="https://sb.scorecardresearch.com/p?c1=2&amp;c2=35880649&amp;cv=3.6.0&amp;cj=1">',
      },
    ],
    __dangerouslyDisableSanitizersByTagID: {
      comScore: ['innerHTML'],
    },
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
  plugins: [
    '~/plugins/requests/index.js',
    '~/plugins/user-behavior-log/index.client.js',
    '~/plugins/vuePluginsGlobal.js',
    // '~/plugins/vuePluginsGlobal.client.js',
  ],
  /*
   ** Nuxt.js Server Middleware
   */
  serverMiddleware: [
    '~/server-middleware/headers.js',
    '~/server-middleware/redis/index.js',
    { path: '/api/youtube', handler: '~/api/youtube.js' },
    { path: '/api/tracking', handler: '~/api/tracking.js' },
    { path: '/api/gcs', handler: '~/api/gcs.js' },
    { path: '/check', handler: '~/server-middleware/health-check.js' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/composition-api',
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
    '@nuxtjs/apollo',
    '@nuxtjs/axios',
    ['@nuxtjs/component-cache', { max: 10000, maxAge: 1000 * 60 * 60 * 24 }],
  ],
  /*
   ** Doc: https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config
   ** See Also: https://nuxtjs.org/blog/moving-from-nuxtjs-dotenv-to-runtime-config
   */
  publicRuntimeConfig: {
    releaseTarget: process.env.RELEASE_TARGET || 'local',
  },
  axios: {
    proxy: true,
  },
  hooks: {
    // Doc: https://nuxtjs.org/docs/2.x/internals-glossary/internals-renderer#hooks
    render: {
      routeDone(url, result, context) {
        if (ENABLE_REDIS && !result.error && result && redisClient) {
          try {
            redisClient.set(
              `${PREFIX}${cleanPathQuery(url)}`,
              JSON.stringify(result.html),
              'EX',
              100
            )
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`[REDIS]Set Redis Failed. url: ${url}`, error)
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
  googleAnalytics: {
    id: () => {
      const domain = document.domain
      if (domain.match(/^(www|nuxt).mnews.tw/gs)) {
        return 'UA-196534751-1'
      }
      if (domain.includes('staging')) {
        return 'UA-196534751-3'
      }
      return 'UA-196534751-2'
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
    extend(config, ctx) {
      /*
       ** To avoid adding `configs/config.js` in bundles,
       ** we should filter out `configs/config.js`
       ** in webpack client side bundles
       */
      if (ctx.isClient) {
        config.plugins.push(
          new webpack.IgnorePlugin({
            checkResource(resource, context) {
              if (
                resource.includes('configs/config') &&
                context.includes(__dirname)
              ) {
                return true
              }
            },
          })
        )
      }
    },
  },
}
