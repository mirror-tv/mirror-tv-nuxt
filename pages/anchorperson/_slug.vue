<template>
  <section class="g-page anchor">
    <div class="anchor__content">
      <img
        v-if="anchorImage"
        class="anchor__content__img"
        :src="anchorImage"
        :alt="anchorName"
      />
      <img
        v-else
        class="anchor__content__img"
        src="~assets/img/image-default.png"
        alt="default image"
      />
      <section class="anchor__block">
        <div class="anchor__info">
          <div class="anchor__info-name">
            <h2 v-text="anchorName" />
          </div>
          <div class="anchor__info-link">
            <a
              v-if="anchorFacebook"
              :href="anchorFacebook"
              target="_blank"
              rel="noreferrer noopener"
              @click="sendGaClickEvent('主播 fb')"
            >
              <img src="~/assets/img/facebook-anchor-link.svg" alt="Facebook" />
            </a>
            <a
              v-if="anchorInstatgram"
              :href="anchorInstatgram"
              target="_blank"
              rel="noreferrer noopener"
              @click="sendGaClickEvent('主播 instagram')"
            >
              <img
                src="~/assets/img/instagram-anchor-link.svg"
                alt="Instagram"
              />
            </a>
            <a
              v-if="anchorTwitter"
              :href="anchorTwitter"
              target="_blank"
              rel="noreferrer noopener"
              @click="sendGaClickEvent('主播 twitter')"
            >
              <img src="~/assets/img/twitter-anchor-link.svg" alt="Twitter" />
            </a>
          </div>
        </div>
        <div v-if="isDesktop" class="anchor__info--intro-desktop">
          <p v-text="anchorBio" />
        </div>
      </section>
      <div v-if="!isDesktop" class="anchor__intro">
        <p v-text="anchorBio" />
      </div>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getDomain } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { fetchContactBySlug } from '~/apollo/queries/contact.gql'

export default {
  apollo: {
    anchor: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.anchorSlug,
        }
      },
      update(data) {
        return data.allContacts?.[0] || {}
      },
    },
  },
  data() {
    return {
      isDesktop: false,
    }
  },
  head() {
    const title = `${this.anchorName} - ${SITE_NAME}`
    const image = this.anchor?.image?.urlTabletSized
    const descrition = this.anchor?.bio ? this.anchor.bio.slice(0, 19) : ''
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
          content: descrition,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: descrition,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
      ],
    }
  },
  computed: {
    anchorSlug() {
      return this.$route.params.slug
    },
    anchorName() {
      return this.anchor.name
    },
    anchorImage() {
      return this.anchor.image?.urlTabletSized
    },
    anchorFacebook() {
      return this.anchor.facebook
    },
    anchorInstatgram() {
      return this.anchor.instatgram
    },
    anchorTwitter() {
      return this.anchor.twitter
    },
    anchorBio() {
      return this.anchor.bio
    },
  },
  mounted() {
    this.isDesktop = process.browser && window.innerWidth >= 1200
  },
  methods: {
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('anchorprofile')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.g-page {
  padding: 70px 16px 58px;
  @include media-breakpoint-up(sm) {
    padding: 20px 16px;
  }
  @include media-breakpoint-up(md) {
    padding: 36px 0;
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
  &__content {
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      height: 100%;
      width: 656px;
    }
    @include media-breakpoint-up(xl) {
      width: 1120px;
    }
    &__img {
      width: 100%;
      height: calc(100vw - 48px);
      background: lightgray;
      object-fit: cover;
      margin-bottom: 12px;
      @include media-breakpoint-up(md) {
        width: 347px;
        height: 347px;
        margin-bottom: 0;
      }
    }
  }
  &__block {
    margin-bottom: 33px;
    @include media-breakpoint-up(md) {
      margin: 0 0 38px 42px;
      width: calc(100% - 347px - 42px);
    }
    @include media-breakpoint-up(xl) {
      margin: 0 0 38px 64px;
      width: calc(100% - 347px - 64px);
    }
  }
  &__info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include media-breakpoint-up(md) {
      height: 347px;
      align-items: flex-start;
    }
    @include media-breakpoint-up(xl) {
      height: auto;
    }
    &-name {
      text-align: left;
      font-weight: 600;
      letter-spacing: 0.5px;
      h2 {
        font-size: 30px;
        line-height: 42px;
        color: #f4f5f6;
      }
    }
    &-link {
      display: flex;
      align-items: flex-start;
      height: 100%;
      @include media-breakpoint-up(md) {
        align-items: flex-end;
      }
      @include media-breakpoint-up(xl) {
        align-items: start;
      }
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: transparent;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        margin-left: 10px;
        img {
          display: block;
          width: 40px;
          height: 40px;
          background: transparent;
        }
      }
    }
    &--intro-desktop {
      width: 100%;
      margin-top: 9px;
      p {
        font-size: 16px;
        line-height: 32px;
        font-weight: 500;
        color: #fff;
      }
    }
  }
  &__intro {
    width: 100%;
    p {
      font-size: 16px;
      line-height: 32px;
      font-weight: 500;
      color: #fff;
    }
  }
}
</style>
