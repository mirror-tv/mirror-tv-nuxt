<template>
  <section class="g-page host">
    <div class="host__content">
      <img :src="hostImage" :alt="hostName" class="host__content__img" />
      <section class="host__info">
        <div class="host__info__header">
          <h2>{{ hostName }}</h2>
          <UiContactSocialLinks
            v-if="shouldShowSocialLinks"
            :facebook="hostFacebook"
            :twitter="hostTwitter"
            :instagram="hostInstagram"
            class="social-links md"
          />
        </div>
        <div v-if="shouldShowHostShows" class="host__info__related-shows">
          <a
            v-for="show in hostShows"
            :key="show.slug"
            :href="show.href"
            target="_blank"
            rel="noreferrer noopener"
            class="host__info__related-shows__item"
          >
            <span>{{ show.name }}</span>
          </a>
        </div>
        <UiContactSocialLinks
          v-if="shouldShowHostShows"
          :facebook="hostFacebook"
          :twitter="hostTwitter"
          :instagram="hostInstagram"
          class="social-links sm"
        />
        <div class="host__info__bio">
          <div
            v-for="paragraph in hostBio"
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
import { handleApiData, handleMetaDesc } from '~/utils/content-handler'
import { getContactImageUrl } from '~/utils/image-handler'
import UiContactSocialLinks from '~/components/UiContactSocialLinks'
import { fetchContactBySlug } from '~/apollo/queries/contact.gql'

export default {
  apollo: {
    host: {
      query: fetchContactBySlug,
      variables() {
        return {
          slug: this.hostSlug,
        }
      },
      update(data) {
        const { name, relatedShows } = data.allContacts?.[0] || {}
        if (!name || !relatedShows.length) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return data.allContacts?.[0] || {}
      },
    },
  },
  components: {
    UiContactSocialLinks,
  },
  data() {
    return {
      host: {},
      has404Err: false,
    }
  },
  head() {
    const title = `${this.hostName} - ${SITE_NAME}`
    const image = this.host?.image?.urlTabletSized
    const bioStr = this.hostBio?.[0]?.content ?? ''
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
    hostSlug() {
      return this.$route.params.name
    },
    hostName() {
      return this.host.name
    },
    hostImage() {
      return getContactImageUrl(this.host)
    },
    hostFacebook() {
      return this.host.facebook
    },
    hostInstagram() {
      return this.host.instagram
    },
    hostTwitter() {
      return this.host.twitter
    },
    hostBio() {
      const bios = handleApiData(this.host.bioApiData)
      return bios.map((item) => {
        return {
          id: item.id || '',
          content: item.content?.[0] || '',
        }
      })
    },
    hostShows() {
      return this.host?.relatedShows?.map((show) => {
        const { slug = '', name = '' } = show || {}
        return { slug, href: `/show/${slug}/main`, name: `《${name}》` }
      })
    },
    shouldShowSocialLinks() {
      return this.hostFacebook || this.hostInstagram || this.hostTwitter
    },
    shouldShowHostShows() {
      return this.hostShows?.length
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
  },
}
</script>

<style lang="scss" scoped>
.host {
  width: 100%;
  display: flex;
  justify-content: center;
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
        width: 405px;
        height: 405px;
      }
    }
  }
  &__info {
    @include media-breakpoint-up(md) {
      margin: 0 0 0 40px;
      width: calc(100% - 288px - 40px);
    }
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 48px;
      width: calc(100% - 405px - 48px);
    }
    .social-links {
      &.md {
        display: none;
        @include media-breakpoint-up(md) {
          display: flex;
        }
      }
      &.sm {
        display: flex;
        margin: 0 0 16px;
        @include media-breakpoint-up(md) {
          display: none;
        }
      }
    }
    &__header {
      margin: 0 0 8px;
      @include media-breakpoint-up(md) {
        display: flex;
        align-items: center;
        margin: 0 0 4px;
      }
      h2 {
        text-align: center;
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        color: $color-blue;
        @include media-breakpoint-up(md) {
          text-align: left;
          font-size: 30px;
          line-height: 42px;
        }
      }
    }
    &__related-shows {
      margin: 0 0 28px;
      @include media-breakpoint-up(md) {
        margin: 0 0 8px;
      }
      @include media-breakpoint-up(xl) {
        margin: 0 0 28px;
      }
      &__item {
        display: block;
        width: 100%;
        span {
          display: inline;
          font-size: 18px;
          font-weight: 500;
          line-height: 1.6;
          text-align: center;
          color: $color-blue-deep;
          @include media-breakpoint-up(md) {
            font-size: 20px;
            text-align: left;
            letter-spacing: 0.5px;
          }
          &:hover {
            border-bottom: 2px solid $color-blue-deep;
          }
        }
      }
      &__item + &__item {
        margin: 8px 0 0;
        @include media-breakpoint-up(md) {
          margin: 4px 0 0;
        }
      }
    }
    &__bio {
      width: 100%;
      p {
        font-size: 16px;
        line-height: 1.8;
      }
      .paragraph + .paragraph {
        margin: 16px 0 0;
      }
    }
  }
}
</style>
