<template>
  <section class="g-page anchor">
    <div class="anchor__content">
      <h1 class="anchor__page-title">鏡主播</h1>
      <ol class="anchor__list">
        <li v-for="anchor in anchors" :key="anchor.slug">
          <a
            :href="`/anchorperson/${anchor.slug}`"
            target="_blank"
            rel="noreferrer noopener"
            @click="sendGaClickEvent('announcer')"
          >
            <img
              v-if="anchor.image"
              :src="anchor.image.urlMobileSized"
              :alt="anchor.name"
            />
            <img
              v-else
              src="~assets/img/image-default.png"
              :alt="anchor.name"
            />
          </a>
          <h3 v-text="anchor.name" />
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { fetchContactByAnchorPerson } from '~/apollo/queries/contact.gql'

export default {
  apollo: {
    anchors: {
      query: fetchContactByAnchorPerson,
      update(data) {
        return data.allContacts
      },
    },
  },
  head() {
    const title = '鏡主播 - 鏡電視'
    const description =
      '鏡新聞與鏡電視是一個由全方位媒體人用專業跟熱情澆灌出來的新聞平台！'

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
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
      ],
    }
  },
  methods: {
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('anchorperson')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.anchor {
  width: 100%;
  display: flex;
  justify-content: center;
  &__page-title {
    width: 100%;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    margin-top: 24px;
    margin-bottom: 16px;
    @include media-breakpoint-up(md) {
      margin-top: 0;
      margin-bottom: 24px;
      font-size: 30px;
      line-height: 35px;
    }
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    @include media-breakpoint-up(sm) {
      max-width: 640px;
      // 使未滿的區塊向左對齊
      &::after {
        content: '';
        width: calc((100% - 64px) / 3);
      }
    }
    @include media-breakpoint-up(xl) {
      max-width: 880px;
      // 使未滿的區塊向左對齊
      &::after {
        content: '';
        width: calc((100% - 48px) / 4);
      }
    }
    li {
      text-align: center;
      width: calc((100% - 32px) / 2);
      margin-bottom: 24px;
      @include media-breakpoint-up(sm) {
        width: calc((100% - 64px) / 3);
        margin-bottom: 40px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 48px) / 4);
      }
      img {
        width: 100%;
        height: 72px;
        background: lightgray;
        object-fit: cover;
        @include media-breakpoint-up(sm) {
          height: 108px;
        }
        @include media-breakpoint-up(xl) {
          height: 117px;
        }
      }
      h3 {
        margin-top: 12px;
        font-size: 16px;
        line-height: 19px;
      }
    }
  }
}
</style>
