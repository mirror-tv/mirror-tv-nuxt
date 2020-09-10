<template>
  <section class="page">
    <div class="max-width-wrapper">
      <div class="list-latest-wrapper">
        <ol class="list-latest">
          <li
            v-for="post in listArticleMainData"
            :key="post.id"
            class="list-latest__list-item list-latest-list-item"
          >
            <ArticleCard
              :href="post.href"
              :articleImgURL="post.articleImgURL"
              :articleTitle="post.articleTitle"
              :articleTitleStyle="'bold'"
              :articleDescription="post.articleDescription"
              :articleDate="post.articleDate"
              :mobileLayoutDirection="'column'"
            />
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script>
import ArticleCard from '~/components/ArticleCard'

export default {
  components: {
    ArticleCard
  },
  data() {
    return {
      listArticleMainData: new Array(12).fill({
        id: 'id',
        href: '/post/test',
        articleImgURL:
          'https://www.mirrormedia.com.tw/assets/images/20200910143758-5922a65dde1d9db47e15efa484ab879a-mobile.jpg',
        articleTitle:
          '【灣區樂活特輯】台南安平好fun鬆　字很多僅限兩行字很多僅限兩行字很多僅限兩行字很多僅限兩行字很多僅限兩行',
        articleDescription:
          '使用者可以看到與搜尋關鍵字高度相關文章之首圖、標題、分類標籤、內容節錄使用者可以看到與搜尋關鍵字高度相關文章之首圖、標題、分類標籤、內容節錄',
        articleDate: new Date()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
  min-height: 100vh;
}

.max-width-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 20px 50px 20px;
  padding-top: calc(130px + 13px);
  @include media-breakpoint-up(xl) {
    padding: 0;
    max-width: calc(180px * 4 + 21px * 3);
    margin: 0 auto;
    flex-direction: row;
  }
}

.list-latest-wrapper {
  display: flex;
  flex-direction: column;
  &__button-load-more {
    align-self: center;
    margin: 30px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 110px 0 0 0;
    }
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
</style>
