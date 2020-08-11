<template>
  <section class="page">
    <div class="max-width-wrapper">
      <main class="main">
        <figure class="post__image">
          <img
            :src="image.mobile"
            :alt="imageCaption"
            sizes="(max-width: 1199px) 100vw, 500px"
            :srcset="`${image.mobile} 0w, ${image.desktop} 1200vw`"
          />
          <figcaption v-text="imageCaption" />
        </figure>
        <div class="post__category-publishTime">
          <span class="post__category" v-text="categoryTitle" />
          <span class="post__publishTime" v-text="formatDate(publishTime)" />
        </div>
        <h1 class="post__title" v-text="title" />
        <div class="post__credit">
          <p v-if="writers">作者｜{{ writers }}</p>
          <p v-if="photographers">攝影｜{{ photographers }}</p>
          <p v-if="cameraOperators">影音｜{{ cameraOperators }}</p>
          <p v-if="designers">設計｜{{ designers }}</p>
          <p v-if="engineers">工程｜{{ engineers }}</p>
          <p v-if="vocals">主播｜{{ vocals }}</p>
        </div>
        <div class="post__brief" v-html="brief" />
      </main>
      <aside class="aside"></aside>
    </div>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import postPublished from '~/apollo/queries/postPublished.gql'

export default {
  apollo: {
    postPublished: {
      query: postPublished,
      variables() {
        return {
          slug: this.$route.params.slug
        }
      }
    }
  },
  computed: {
    brief() {
      try {
        const brief = JSON.parse(this.postPublished?.[0]?.brief)
        return brief?.html
      } catch {
        return ''
      }
    },
    categoryTitle() {
      return this.postPublished?.[0]?.categories?.[0]?.title
    },
    cameraOperators() {
      return this.postPublished?.[0]?.cameraOperators
        .map((item) => item.name)
        .join('、')
    },
    content() {
      try {
        const content = JSON.parse(this.postPublished?.[0]?.content)
        return content.apiData.filter((item) => item)
      } catch {
        return []
      }
    },
    designers() {
      return this.postPublished?.[0]?.designers
        .map((item) => item.name)
        .join('、')
    },
    engineers() {
      return this.postPublished?.[0]?.engineers
        .map((item) => item.name)
        .join('、')
    },
    image() {
      return this.postPublished?.[0]?.heroImage
    },
    imageCaption() {
      return this.postPublished?.[0]?.heroCaption
    },
    publishTime() {
      return this.postPublished?.[0]?.publishTime
    },
    photographers() {
      return this.postPublished?.[0]?.photographers
        .map((item) => item.name)
        .join('、')
    },
    title() {
      return this.postPublished?.[0]?.title
    },
    vocals() {
      return this.postPublished?.[0]?.vocals.map((item) => item.name).join('、')
    },
    writers() {
      return this.postPublished?.[0]?.writers
        .map((item) => item.name)
        .join('、')
    }
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY.MM.DD HH:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  margin: 0 auto;
}

$maxWidthDesktop: 1000;
$asideWidthDesktop: 380;

.max-width-wrapper {
  padding: 50px 20px 50px;
  @include media-breakpoint-up(xl) {
    display: flex;
    max-width: #{$maxWidthDesktop}px;
    padding: 0;
    margin: 0 auto;
  }
}

.main {
  @include media-breakpoint-up(xl) {
    width: 500px;
    padding: 50px 0;
    + aside {
      margin-left: 118px;
    }
  }
}

.post {
  &__image {
    display: block;
    width: calc(100% + 40px);
    transform: translateX(-20px);
    + * {
      margin-top: 30px;
    }
    @include media-breakpoint-up(xl) {
      width: auto;
      transform: none;
    }
    img {
      width: 100%;
    }
    figcaption {
      padding: 10px 20px 0;
      color: #000000;
      font-size: 14px;
      line-height: 1.57;
      @include media-breakpoint-up(xl) {
        padding: 7px 0 0;
      }
    }
  }
  &__category-publishTime {
    display: flex;
    justify-content: space-between;
  }
  &__category {
    color: #014db8;
    font-size: 16px;
    font-weight: 500;
  }
  &__publishTime {
    color: #000000;
    font-size: 14px;
    line-height: 1.57;
    text-align: right;
  }
  &__title {
    margin: 10px 0 0;
    color: #000000;
    font-size: 20px;
    font-weight: 500;
    + * {
      margin-top: 10px;
    }
  }
  &__credit {
    p {
      display: inline-block;
      + p {
        margin-left: 10px;
      }
    }
  }
  &__brief {
    display: inline-block;
    margin: 30px 0 0;
    padding: 24px 10px;
    color: #014db8;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.63;
    text-align: justify;
    border: 3px solid;
    border-image: linear-gradient(
        to bottom,
        #014db8 20%,
        white 20%,
        white 80%,
        #014db8 80%
      )
      5;
  }
}

.aside {
  @include media-breakpoint-up(xl) {
    width: #{$asideWidthDesktop}px;
    padding: 50px 0;
    background-color: #e7e7e7;
  }
}
</style>
