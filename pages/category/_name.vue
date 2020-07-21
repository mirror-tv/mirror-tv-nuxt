<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main>
        <div>
          <H1Bordered class="list-latest-title" :text="pageName" />
          <ol class="list-latest">
            <li
              v-for="(item, i) in 13"
              :key="item"
              class="list-latest__list-item list-latest-list-item"
            >
              <ArticleCardFeatured
                v-if="i === 0"
                class="list-latest-list-item__featured"
                :href="articleLatestsMock.href"
                :articleImgURL="articleLatestsMock.articleImgURL"
                :articleTitle="articleLatestsMock.articleTitle"
                :articleDate="articleLatestsMock.articleDate"
              />
              <ArticleCard
                v-else
                :href="articleLatestsMock.href"
                :articleImgURL="articleLatestsMock.articleImgURL"
                :articleTitle="articleLatestsMock.articleTitle"
                :articleDate="articleLatestsMock.articleDate"
                :mobileLayoutDirection="'column'"
              />
            </li>
          </ol>
        </div>
      </main>
      <aside></aside>
    </div>
  </section>
</template>

<script>
import H1Bordered from '~/components/H1Bordered'
import ArticleCardFeatured from '~/components/ArticleCardFeatured'
import ArticleCard from '~/components/ArticleCard'

export default {
  components: {
    H1Bordered,
    ArticleCardFeatured,
    ArticleCard
  },
  data() {
    return {
      articleLatestsMock: {
        href: 'https://www.mirrormedia.mg/story/20200715edi026/',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200715135810-51b41bed253ae37fe37c5f9972844e09-mobile.jpg',
        articleTitle: '振興券上路最大咖好禮　黃偉哲：來台南旅遊消費抽房子',
        articleDate: new Date(2020, 0, 2, 3, 4, 5)
      }
    }
  },
  computed: {
    pageName() {
      return this.$route.params.name
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

.list-latest-title {
  min-width: 110px;
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
    &:first-child {
      width: 100vw;
      position: relative;
      left: -20px;
      @include media-breakpoint-up(xl) {
        width: auto;
        left: 0;
      }
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
    /*background-color: #e7e7e7;*/
  }
}
</style>
