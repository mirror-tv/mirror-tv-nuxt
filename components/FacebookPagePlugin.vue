<template>
  <div
    class="fb-page"
    :data-href="href"
    data-tabs=""
    data-width="500px"
    data-height="162px"
    data-small-header="false"
    data-adapt-container-width="true"
    data-hide-cover="false"
    data-show-facepile="false"
  >
    <blockquote :cite="href" class="fb-xfbml-parse-ignore">
      <a :href="href" v-text="pageName" />
    </blockquote>
  </div>
</template>

<script>
export default {
  name: 'FacebookPagePlugin',
  props: {
    href: {
      type: String,
      default: 'https://www.facebook.com/mnewstw/',
    },
    pageName: {
      type: String,
      default: '鏡電視',
    },
  },
  mounted() {
    if (window.FB) {
      this.$nextTick(() => window.FB.XFBML.parse())
    } else {
      this.insertRootDiv()
      this.insertSDK()
    }
  },
  methods: {
    insertRootDiv() {
      if (!document.getElementById('fb-root')) {
        const rootDiv = document.createElement('div')
        rootDiv.id = 'fb-root'
        document.body.appendChild(rootDiv)
      }
    },
    insertSDK() {
      if (!document.getElementById('fb-sdk')) {
        const script = document.createElement('script')
        script.id = 'fb-sdk'
        script.src =
          'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v8.0'
        script.crossorigin = 'anonymous'
        document.body.appendChild(script)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fb-page {
  flex: 1;
  display: block;
  max-width: 100%;
  overflow: hidden;
}
</style>
