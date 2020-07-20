<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main>
        <div>
          <H1Bordered :text="'最新文章'" />
          <ol class="list-latest">
            <li v-for="item in 12" :key="item">
              <ArticleCard
                :href="articleLatestsMock.href"
                :labelTitle="articleLatestsMock.labelTitle"
                :articleImgURL="articleLatestsMock.articleImgURL"
                :articleTitle="articleLatestsMock.articleTitle"
                :articleDate="articleLatestsMock.articleDate"
              />
            </li>
          </ol>
        </div>
      </main>
      <aside>
        <IframeFacebookPagePlugin />
      </aside>
    </div>
  </section>
</template>

<script>
import IframeFacebookPagePlugin from '~/components/IframeFacebookPagePlugin.vue'
import H1Bordered from '~/components/H1Bordered'
import ArticleCard from '~/components/ArticleCard'

export default {
  components: {
    IframeFacebookPagePlugin,
    H1Bordered,
    ArticleCard
  },
  data() {
    return {
      articleLatestsMock: {
        href: 'https://www.mirrormedia.mg/story/20200715edi026/',
        labelTitle: '生活',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
        articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
        articleDate: new Date(2020, 0, 2, 3, 4, 5)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
  min-height: 100vh;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 380;
$mainWidthDesktop: $maxWidthDesktop - $asideWidthDesktop;
.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 50px 20px;
  @include media-breakpoint-up(xl) {
    padding: 0;
    max-width: #{$maxWidthDesktop}px;
    margin: 0 auto;
    flex-direction: row;
  }
}

main {
  @include media-breakpoint-up(xl) {
    width: #{$mainWidthDesktop}px;
    padding: 60px 0 50px 0;
  }
}

.list-latest {
  margin: 20px 0 0 0;
  @include media-breakpoint-up(xl) {
    display: flex;
    flex-wrap: wrap;
    margin: 20px 0 -26px -21px;
  }
  li {
    margin: 0 0 20px 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 26px 21px;
    }
  }
}

aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 60px 40px;
    background-color: #e7e7e7;
  }
}
</style>
