<template>
  <div class="g-page">
    <div class="adsales__container">
      <a :href="adSalesUrl" target="_blank" rel="noreferer noopener">
        <img src="~/static/default.jpg" alt="adsales picture" />
        <h3>點擊圖片觀看整合行銷內容</h3>
      </a>
      <ClientOnly>
        <iframe :src="adSalesUrl">
          <p>抱歉，您的裝置不支援此瀏覽形式</p>
        </iframe>
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { fetchAllSales } from '~/apollo/queries/allSales.gql'

export default {
  apollo: {
    adSales: {
      query: fetchAllSales,
      update(data) {
        return data.allSales?.[0]
      },
    },
  },
  data() {
    return {
      adSales: {},
    }
  },
  head() {
    const title = `整合行銷 - ${SITE_NAME}`
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getDomain()}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
      ],
    }
  },
  computed: {
    adSalesUrl() {
      return this.adSales?.pdfUrl
    },
  },
}
</script>

<style lang="scss" scoped>
.adsales__container {
  width: 100%;
  margin: 0 auto;
  @include media-breakpoint-up(md) {
    width: 600px;
    background-color: #000;
    padding: 10px;
  }
  @include media-breakpoint-up(xl) {
    width: 1120px;
    padding: 16px 20px;
  }
  @include media-breakpoint-up(xxl) {
    width: 1200px;
  }
  a {
    display: block;
    text-align: center;
    margin-top: 10px;
    @include media-breakpoint-up(sm) {
      margin-top: 0;
    }
    @include media-breakpoint-up(md) {
      display: none;
    }
    img {
      margin-bottom: 10px;
      border-radius: 4px;
    }
    h3 {
      font-size: 14px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 0.5px;
      color: $color-blue-deep;
    }
  }
  iframe {
    display: none;
    @include media-breakpoint-up(md) {
      display: block;
      width: 100%;
      height: 180vh;
      p {
        font-size: 14px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0.5px;
        color: $color-blue-deep;
      }
    }
  }
}
</style>
