<template>
  <div class="g-page anchor">
    <div class="anchor__content">
      <section class="anchor__block">
        <h1 class="anchor__title">鏡主播</h1>
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
          <div class="position-correct" />
        </ol>
      </section>

      <section>
        <h1 class="anchor__title">鏡主持</h1>
        <ol class="anchor__list">
          <li v-for="host in hosts" :key="host.slug">
            <a
              :href="`/anchorperson/${host.slug}`"
              target="_blank"
              rel="noreferrer noopener"
              @click="sendGaClickEvent('announcer')"
            >
              <img
                v-if="host.image"
                :src="host.image.urlMobileSized"
                :alt="host.name"
              />
              <img
                v-else
                src="~assets/img/image-default.png"
                :alt="host.name"
              />
            </a>
            <h3 v-text="host.name" />
          </li>
          <div class="position-correct" />
        </ol>
      </section>
    </div>
  </div>
</template>

<script>
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import {
  fetchContactByAnchorPerson,
  fetchContactByHosts,
} from '~/apollo/queries/contact.gql'

export default {
  apollo: {
    anchors: {
      query: fetchContactByAnchorPerson,
      update(data) {
        return data.allContacts
      },
    },
    hosts: {
      query: fetchContactByHosts,
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
.g-page {
  padding: 58px 16px;
  @include media-breakpoint-up(sm) {
    padding: 8px 16px;
  }
  @include media-breakpoint-up(xl) {
    padding: 35px 0 0;
  }
}
.anchor {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #303030;
  &__block {
    margin: 20px 0 37px;
    @include media-breakpoint-up(md) {
      margin: 40px 0 37px;
    }
    @include media-breakpoint-up(xl) {
      margin: 40px 0 80px;
    }
  }
  &__title {
    position: relative;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    color: #fc0;
    margin: 24px 0 16px;
    @include media-breakpoint-up(md) {
      font-size: 30px;
      line-height: 42px;
      margin: 0 0 24px;
      &::after {
        content: '';
        position: absolute;
        left: 110px;
        right: 0;
        top: 50%;
        height: 2px;
        background-color: #ffcc01;
      }
    }
  }
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &::after {
      content: '';
      width: calc((100% - 64px) / 2);
    }
    @include media-breakpoint-up(md) {
      max-width: 608px;
      // 使未滿的區塊向左對齊
      &::after {
        content: '';
        width: calc((100% - 32px) / 3);
      }
    }
    @include media-breakpoint-up(xl) {
      max-width: 1120px;
      // 使未滿的區塊向左對齊
      &::after {
        content: '';
        width: calc((100% - 96px) / 4);
      }
    }
    li {
      text-align: center;
      width: calc((100% - 32px) / 2);
      margin: 0 0 24px;
      @include media-breakpoint-up(md) {
        width: calc((100% - 32px) / 3);
        margin: 0 0 14px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
        margin: 0 0 17px;
      }
      img {
        width: 100%;
        height: calc((100vw - 64px) / 2 * 0.56);
        background: lightgray;
        object-fit: cover;
        @include media-breakpoint-up(md) {
          height: 108px;
        }
        @include media-breakpoint-up(xl) {
          height: 144px;
        }
      }
      h3 {
        margin-top: 12px;
        font-size: 16px;
        line-height: 22px;
        color: #d8d8d8;
      }
    }
    .position-correct {
      width: calc((100% - 32px) / 2);
      overflow: hidden;
      @include media-breakpoint-up(md) {
        width: calc((100% - 32px) / 3);
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
      }
    }
  }
}
</style>
