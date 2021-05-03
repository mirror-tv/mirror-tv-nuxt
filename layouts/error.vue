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
            v-for="article in latestArticleList"
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
            <h4>{{ article.title }}</h4>
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
import allPublishedPosts from '~/apollo/queries/allPublishedPosts.gql'

export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
  apollo: {
    allPostsLatest: {
      query: allPublishedPosts,
      variables: {
        first: 3,
      },
      update: (data) => data.allPublishedPosts,
    },
  },
  computed: {
    is404() {
      return this.error.statusCode === 404
    },
    latestArticleList() {
      const listData = this.allPostsLatest ?? []
      return listData.map((post) => this.reducerArticleCard(post))
    },
  },
  methods: {
    reducerArticleCard(post) {
      return {
        slug: post.slug,
        href: `/story/${post.slug}`,
        imgURL: post.heroImage?.urlMobileSized,
        title: this.truncated(post.name),
      }
    },
    truncated(title) {
      const limit = 23
      if (title.length <= limit) {
        return title
      }
      return title.substring(0, limit).concat('...')
    },
  },
}
</script>

<style lang="scss" scoped>
$font: Arial Rounded MT Bold, Arial;

.error {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #003365;
  min-height: 100vh;
  overflow: hidden;

  .container {
    position: relative;
  }
  .error_info {
    color: #fff;
    margin-bottom: 48px;
    &_heading {
      font-family: $font;
      font-size: 85px;
      line-height: 1;
      margin: 30px 0 20px;
      // tablet range
      @include media-breakpoint-up(md) {
        font-size: 150px;
        margin: 0 0 60px;
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
        align-items: center;
      }
      a {
        display: flex;
        width: 100%;
        padding: 0 16px;
        text-align: left;
        @include media-breakpoint-up(md) {
          display: block;
          width: 180px;
          margin-right: 24px;
          padding: 0;
          &:last-child {
            margin-right: 0;
          }
        }
        img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          object-position: center;
          background-color: $color-grey;
          margin: 0 16px 16px 0;
          @include media-breakpoint-up(md) {
            margin: 0 0 12px 0;
            width: 100%;
            height: 120px;
          }
        }
        h4 {
          width: 100%;
          font-size: 16px;
          line-height: 22px;
          color: #fff;
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
      height: 83px;
      width: 50vw;
      top: 86px;

      // tablet range
      @include media-breakpoint-up(md) {
        top: 100px;
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
      left: 50px;
      transform: translate(-100%, 0);
      @include media-breakpoint-up(sm) {
        left: 110px;
      }
      // tablet range
      @include media-breakpoint-up(md) {
        left: 60px;
      }
    }

    .error__wire_right {
      right: 50px;
      transform: translate(100%, 0) scaleX(-1);
      @include media-breakpoint-up(sm) {
        right: 110px;
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
        height: 45px;
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
      width: 190px;
      transform: translateY(-50%);

      // tablet range
      @include media-breakpoint-up(md) {
        width: 370px;
      }

      // desktop range
      @include media-breakpoint-up(xl) {
        width: 420px;
      }
    }
    .error_info {
      display: flex;
      flex-direction: column;
      &_heading {
        align-self: flex-end;
        display: inline-block;
        font-size: 70px;
        color: #fff;
        letter-spacing: 4px;
        margin: 0;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 152px;
          letter-spacing: 6px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 184px;
          letter-spacing: 5px;
        }
      }

      &_text {
        font-size: 14px;

        // tablet range
        @include media-breakpoint-up(md) {
          font-size: 26px;
        }

        // desktop range
        @include media-breakpoint-up(xl) {
          font-size: 28px;
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
