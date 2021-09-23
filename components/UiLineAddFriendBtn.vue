<template>
  <div class="line">
    <div
      class="line-it-button"
      data-lang="zh_Hant"
      data-type="friend"
      data-lineid="@lineteamjp"
      data-count="true"
      data-home="true"
      style="display: none"
    />
  </div>
</template>

<script>
export default {
  head() {
    return {
      script: [
        {
          hid: 'line',
          body: true,
          async: true,
          defer: true,
          src:
            'https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  &::v-deep {
    .iframe {
      min-width: 300px;
    }
  }
}
</style>
