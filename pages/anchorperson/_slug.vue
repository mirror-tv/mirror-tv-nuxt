<template>
  <section class="g-page anchor">
    <div class="anchor__content">
      <img :src="anchorImage" :alt="anchorName" class="anchor__content__img" />
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
              class="anchor__info-link--facebook"
              @click="sendGaClickEvent('主播 fb')"
            >
              <img v-lazy="require('@/assets/img/flogo.svg')" alt="Facebook" />
            </a>
            <a
              v-if="anchorInstagram"
              :href="anchorInstagram"
              target="_blank"
              rel="noreferrer noopener"
              class="anchor__info-link--instagram"
              @click="sendGaClickEvent('主播 instagram')"
            >
              <img
                v-lazy="require('~/assets/img/IG-logo.svg')"
                alt="Instagram"
              />
            </a>
            <a
              v-if="anchorTwitter"
              :href="anchorTwitter"
              target="_blank"
              rel="noreferrer noopener"
              class="anchor__info-link--twitter"
              @click="sendGaClickEvent('主播 twitter')"
            >
              <img src="~/assets/img/twitter-anchor-link.svg" alt="Twitter" />
            </a>
          </div>
        </div>
        <div class="anchor__intro">
          <div
            v-for="paragraph in anchorBio"
            :key="paragraph.id"
            class="paragraph"
          >
            <!-- eslint-disable vue/no-v-html -->
            <p v-html="paragraph.content" />
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { handleApiData, handleMetaDesc } from '~/utils/content-handler'
import { getContactImageUrl } from '~/utils/image-handler'
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
        if (!data.allContacts?.[0]?.name) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return data.allContacts?.[0] || {}
      },
    },
  },
  data() {
    return {
      anchor: {},
      has404Err: false,
    }
  },
  head() {
    const title = `${this.anchorName} - ${SITE_NAME}`
    const image = this.anchor?.image?.urlTabletSized
    const bioStr = this.anchorBio?.[0]?.content ?? ''
    const description = handleMetaDesc(bioStr)
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${getUrlOrigin(this.$config)}${this.$route.path}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: image,
        },
        ...(description
          ? [
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
            ]
          : []),
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
      return getContactImageUrl(this.anchor)
    },
    anchorFacebook() {
      return this.anchor.facebook
    },
    anchorInstagram() {
      return this.anchor.instagram
    },
    anchorTwitter() {
      return this.anchor.twitter
    },
    anchorBio() {
      const bios = handleApiData(this.anchor.bioApiData)
      return bios.map((item) => {
        return {
          id: item.id || '',
          content: item.content?.[0] || '',
        }
      })
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('anchorprofile')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.anchor {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #303030;
  &__content {
    @include media-breakpoint-up(md) {
      display: flex;
      width: 688px;
    }
    @include media-breakpoint-up(xl) {
      width: 1120px;
    }
    @include media-breakpoint-up(xxl) {
      width: 1200px;
    }
    &__img {
      width: 100%;
      height: calc(100vw - 48px);
      background: lightgray;
      object-fit: cover;
      object-position: center;
      margin-bottom: 16px;
      @include media-breakpoint-up(md) {
        width: 288px;
        height: 288px;
        margin-bottom: 0;
      }
      @include media-breakpoint-up(xl) {
        width: 480px;
        height: 480px;
      }
    }
  }
  &__block {
    @include media-breakpoint-up(md) {
      margin: 0 0 0 40px;
      width: calc(100% - 288px - 40px);
    }
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 48px;
      width: calc(100% - 480px - 48px);
    }
  }
  &__info {
    margin-bottom: 24px;
    @include media-breakpoint-up(md) {
      display: flex;
      align-items: center;
    }
    &-name {
      text-align: center;
      margin-bottom: 16px;
      @include media-breakpoint-up(md) {
        text-align: left;
        margin-bottom: 0;
      }
      h2 {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        color: #f4f5f6;
        @include media-breakpoint-up(md) {
          font-size: 30px;
          line-height: 42px;
        }
      }
    }
    &-link {
      display: flex;
      justify-content: center;
      @include media-breakpoint-up(md) {
        justify-content: start;
        margin-left: 12px;
      }
      a {
        position: relative;
        width: 20px;
        height: 20px;
        margin: 0 6px;
        @include media-breakpoint-up(md) {
          margin: 0 0 0 12px;
        }
        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  &__intro {
    width: 100%;
    p {
      font-size: 16px;
      color: #fff;
      @include media-breakpoint-up(md) {
        line-height: 1.8;
      }
    }
    .paragraph + .paragraph {
      margin: 16px 0 0;
    }
  }
}
</style>
