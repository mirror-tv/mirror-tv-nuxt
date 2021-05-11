<template>
  <div :class="[{ 'server-error': !is404, 'not-found': is404 }, 'error']">
    <div v-if="is404" class="container">
      <div class="error_info">
        <h1 class="error_info_heading">404</h1>
        <NuxtLink class="error_info_link" to="/">HOME</NuxtLink>
      </div>

      <div class="article_container">
        <h3>熱門文章</h3>
        <div class="article_list">
          <a
            v-for="article in listArticlePopularData"
            :key="article.slug"
            :href="article.href"
            rel="noreferrer noopener"
          >
            <img
              v-if="article.imgURL"
              :src="article.imgURL"
              :alt="article.title"
            />
            <img
              v-else
              src="~assets/img/image-default.png"
              :alt="article.title"
            />
            <p>{{ article.title }}</p>
          </a>
        </div>
      </div>

      <div class="error__wire_left">
        <img class="error__icon plug" src="~/assets/img/plug.svg" />
        <div class="error__wire_1" />
        <div class="error__wire_2" />
      </div>

      <div class="error__wire_right">
        <img class="error__icon socket" src="~/assets/img/socket.svg" />
        <div class="error__wire_1" />
        <div class="error__wire_2" />
      </div>
    </div>

    <div v-else class="container">
      <div class="error_info">
        <h1 class="error_info_heading">50<span class="drop_zero">0</span></h1>

        <p class="error_info_text">這個網頁無法正常運作</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      popularData: {},
    }
  },
  async fetch() {
    try {
      this.popularData = await this.$fetchPopularListData()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  },
  computed: {
    is404() {
      return this.error.statusCode === 404
    },
    listArticlePopularData() {
      const listData = this.popularData?.report ?? []
      return listData
        .filter((item, i) => i < 3)
        .map((report) => this.reducerArticleCard(report))
    },
  },
  methods: {
    reducerArticleCard(post) {
      return {
        slug: post.slug,
        href: `/story/${post.slug}`,
        imgURL: post.heroImage?.urlMobileSized,
        title: post.name,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
$font: Arial Rounded MT Bold, Arial;

.error {
  display: flex;
  justify-content: center;
  background-color: #003365;
  min-height: 100vh;
  overflow: hidden;

  .container {
    position: relative;
  }
  .error_info {
    color: #fff;
    margin: 40px 0 48px;
    @include media-breakpoint-up(md) {
      margin: 90px 0 48px;
    }
    &_heading {
      font-family: $font;
      font-size: 70px;
      line-height: 1;
      margin-bottom: 20px;
      // tablet range
      @include media-breakpoint-up(md) {
        font-size: 150px;
        margin-bottom: 50px;
      }
    }

    &_link {
      display: inline-block;
      color: #ffcc01;
      font-size: 20px;
      font-family: $font;
      letter-spacing: 3.3px;
      line-height: 23px;
      text-decoration: underline;
      // tablet range
      @include media-breakpoint-up(md) {
        padding: 0;
        font-weight: 400;
        font-size: 50px;
        line-height: 58px;
      }
    }
  }
  .article_container {
    padding: 0 16px;
    h3 {
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      color: #fff;
    }
    .article_list {
      @include media-breakpoint-up(md) {
        display: flex;
        justify-content: center;
      }
      a {
        display: flex;
        margin-bottom: 16px;
        @include media-breakpoint-up(md) {
          display: block;
          width: 180px;
          margin: 0 24px 0 0;
          padding: 0;
          &:last-child {
            margin: 0;
          }
        }
        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          object-position: center;
          background-color: $color-grey;
          margin-right: 16px;
          @include media-breakpoint-up(md) {
            margin: 0 0 12px 0;
            width: 100%;
            height: 120px;
          }
        }
        p {
          height: 44px; // 為了避免高度自適應，導致文字截斷破版
          text-align: left;
          font-size: 16px;
          line-height: 22px;
          color: #fff;
          word-wrap: break-word;
          word-break: break-all;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          overflow: hidden;
          @include media-breakpoint-up(md) {
            height: auto;
            -webkit-line-clamp: 3;
          }
        }
      }
    }
  }

  &.not-found {
    .container {
      text-align: center;
      // transform: translateY(-50%);
    }

    .error__wire_left,
    .error__wire_right {
      position: absolute;
      display: flex;
      width: 50vw;
      top: 86px;
      @include media-breakpoint-up(xl) {
        height: 86px;
      }

      // tablet range
      @include media-breakpoint-up(md) {
        top: 190px;
      }

      .error__wire_1 {
        width: 0%;
        height: 100%;
        border-bottom: 4px solid #979797;
        // desktop range
        @include media-breakpoint-up(xl) {
          width: auto;
          flex: 1;
        }
      }
      .error__wire_2 {
        width: 100%;
        height: 100%;
        border-top: 4px solid #979797;
        border-left: 4px solid #979797;
        // desktop range
        @include media-breakpoint-up(xl) {
          width: 197px;
        }
      }
    }

    .error__wire_left {
      left: calc(50vw - 100px);
      transform: translate(-100%, 0);
      @include media-breakpoint-up(sm) {
        left: 170px;
      }
      // tablet range
      @include media-breakpoint-up(md) {
        left: 60px;
      }
    }

    .error__wire_right {
      right: calc(50vw - 100px);
      transform: translate(100%, 0) scaleX(-1);
      @include media-breakpoint-up(sm) {
        right: 170px;
      }
      // tablet range
      @include media-breakpoint-up(md) {
        right: 60px;
      }
    }

    .error__icon {
      position: absolute;
      top: 0;
      height: 34px;
      // tablet range
      @include media-breakpoint-up(md) {
        height: 68px;
      }
      &.plug {
        right: 0;
        transform: translate(35%, -46%);
      }
      &.socket {
        right: 0;
        transform: translate(15%, -46%) rotate(180deg);
      }
    }
  }

  &.server-error {
    .container {
      width: 230px;

      // tablet range
      @include media-breakpoint-up(md) {
        width: 400px;
      }

      // desktop range
      @include media-breakpoint-up(xl) {
        width: 484px;
      }
    }
    .error_info {
      display: flex;
      flex-direction: column;
      margin-top: 120px;
      &_heading {
        align-self: flex-end;
        display: inline-block;
        font-size: 100px;
        color: #fff;
        letter-spacing: 3px;
        margin: 0;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 160px;
          letter-spacing: 10px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 200px;
          letter-spacing: 8px;
        }
      }

      &_text {
        font-size: 14px;
        letter-spacing: 1px;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 26px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 30px;
          letter-spacing: 2px;
        }
      }

      .drop_zero {
        display: inline-block;
        transform: rotate(29deg) translate(30%, 30%);
      }
    }
  }
}
</style>
