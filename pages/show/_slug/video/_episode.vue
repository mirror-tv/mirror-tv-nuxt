<template>
  <ShowWrapper
    gaCategory="ArtShow"
    :currentShow="currentShow"
    :showName="showName"
    :picture="showPicture"
    :shouldShowBreadCrum="true"
    :section="section"
    :series="series"
    :artShow="artShow"
  >
    <section class="artshow__episode">
      <main class="artshow__episode__main">
        <div class="artshow__episode__main__links">
          <div class="artshow__episode__main__links-community">
            <ShareFacebook class="community-fb" />
            <ShareLine class="community-line" />
          </div>
          <!-- <button
            type="button"
            class="artshow__episode__main__links-schedule"
            @click="handleAddSchedule"
          >
            加入行事曆
          </button> -->
        </div>
        <div class="artshow__episode__main__herovideo">
          <ClientOnly>
            <YoutubeEmbedByIframeApi
              v-if="heroVideoUrl"
              :videoId="heroVideoUrl"
              @send-first-play-ga="sendGaClickEvent('youtube video')"
            />
          </ClientOnly>
        </div>
        <article class="artshow__episode__main__content">
          <template v-if="isContentString">
            {{ content }}
          </template>
          <template v-else>
            <ArticleContentHandler
              v-for="paragraph in content"
              :key="paragraph.id"
              :paragraph="paragraph"
              :insertedYoutubeVideoTitle="'節目預告'"
            />
          </template>
        </article>
      </main>
      <aside class="artshow__episode__aside">
        <ul v-if="hasAuthors">
          <li v-for="author in authors" :key="author.slug">
            <UiDirectorCard
              :href="author.href"
              :name="author.name"
              :image="author.image"
              :bio="author.bio.content"
              @click-director-card="sendGaClickEvent('producer')"
            />
          </li>
        </ul>
      </aside>
    </section>
  </ShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { getContactImageUrl, getVideoImageUrl } from '~/utils/image-handler'
import {
  handleYoutubeId,
  handleApiData,
  handleMetaDesc,
} from '~/utils/content-handler'
import ShowWrapper from '~/components/ShowWrapper'
import ArticleContentHandler from '~/components/ArticleContentHandler'
import ShareFacebook from '~/components/ShareFacebook'
import ShareLine from '~/components/ShareLine'
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
import UiDirectorCard from '~/components/UiDirectorCard'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchArtShowBySlug } from '~/apollo/queries/artShow.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentShow,
        }
      },
      update(data) {
        const item = data.allShows?.[0] || {}
        if (!item?.name || !item.isArtShow) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return item
      },
    },
    artShow: {
      query: fetchArtShowBySlug,
      variables() {
        return {
          slug: this.currentArtShow,
        }
      },
      update(data) {
        if (!data.allArtShows?.[0]?.name) {
          this.has404Err = true
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
        }
        return data.allArtShows?.[0] || {}
      },
    },
  },
  components: {
    ShowWrapper,
    ArticleContentHandler,
    ShareFacebook,
    ShareLine,
    YoutubeEmbedByIframeApi,
    UiDirectorCard,
  },
  data() {
    return {
      show: {},
      artShow: {},
      has404Err: false,
    }
  },
  head() {
    const title = this.artShowName
      ? `${this.artShowName} - ${SITE_NAME}`
      : SITE_NAME
    const image = this.artShowImage ?? ''
    const ogUrl = `${getUrlOrigin(this.$config)}${this.$route.path}`
    const description = handleMetaDesc(this.showIntroduction)
    return {
      title,
      meta: [
        {
          hid: 'og:url',
          property: 'og:url',
          content: ogUrl,
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
    currentShow() {
      return this.$route.params.slug ?? ''
    },
    showName() {
      return this.show?.name ?? ''
    },
    showIntroduction() {
      return this.show?.introduction ?? ''
    },
    showPicture() {
      return this.show?.picture ?? {}
    },
    currentArtShow() {
      return this.$route.params.episode ?? ''
    },
    series() {
      return this.artShow?.series?.[0] ?? { slug: '', name: '' }
    },
    section() {
      return this.series?.section?.[0] ?? { slug: '', name: '' }
    },
    heroVideoUrl() {
      const url = this.artShow?.heroVideo?.youtubeUrl ?? ''
      return url ? handleYoutubeId(url) : ''
    },
    artShowName() {
      return this.artShow?.name ?? ''
    },
    artShowImage() {
      return getVideoImageUrl(this.artShow)
    },
    authors() {
      return (
        this.artShow?.author
          ?.filter((item, i) => i < 4)
          ?.map((item) => this.reduceAuthor(item)) ?? []
      )
    },
    content() {
      return handleApiData(this.artShow.contentApiData)
    },
    isContentString() {
      return typeof this.content === 'string'
    },
    hasAuthors() {
      return this.authors && this.authors.length
    },
  },
  mounted() {
    if (this.has404Err) {
      this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    reduceAuthor(item) {
      return {
        href: `/anchorperson/${item.slug}`,
        name: item.name,
        image: getContactImageUrl(item),
        bio: this.formatBio(item),
      }
    },
    formatBio(item) {
      const bios = handleApiData(item.bioApiData)
      const array = bios.map((item) => {
        return {
          id: item.id || '',
          content: item.content?.[0] || '',
        }
      })
      return array[0] ?? { id: '', content: '' }
    },
    handleAddSchedule() {
      this.sendGaClickEvent('加入行事曆')
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('artShow')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow__episode {
  width: 100%;
  margin: 12px 0 40px;
  @include media-breakpoint-up(xl) {
    display: flex;
    justify-content: space-between;
    margin: 20px 0 40px;
  }
  &__main {
    width: 100%;
    @include media-breakpoint-up(xl) {
      width: calc(100% - 200px - 72px);
    }
    &__links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-community {
        display: flex;
        align-items: center;
        .community-fb {
          margin: 0 12px 0 0;
        }
      }
      &-schedule {
        font-size: 13px;
        line-height: 18px;
        color: #4a4a4a;
        padding: 5px 8px;
        border: 1px solid #d8d8d8;
        &:hover,
        &:focus,
        &:active {
          outline: none;
          background-color: rgba(155, 155, 155, 0.15);
        }
      }
    }
    &__herovideo {
      margin: 20px 0 0;
      width: calc(100% + 32px);
      transform: translateX(-16px);
      @include media-breakpoint-up(md) {
        width: 100%;
        transform: none;
      }
    }
    &__content {
      margin: 40px 0 0;
      color: #000;
      font-size: 16px;
      text-align: justify;
      line-height: 1.75;
      ::v-deep {
        > * + * {
          margin: 16px 0 0;
        }
        .g-youtube-with-title {
          color: $color-blue;
          margin: 48px 0 0;
          @include media-breakpoint-up(md) {
            width: 420px;
          }
          @include media-breakpoint-up(xl) {
            width: 435px;
          }
          h2 {
            margin: 0 0 20px;
          }
        }
      }
    }
  }
  &__aside {
    margin: 48px 0 0;
    @include media-breakpoint-up(md) {
      margin: 72px 0 0;
    }
    @include media-breakpoint-up(xl) {
      margin: 60px 0 0;
      width: 200px;
    }
    ul {
      padding: 0 12px;
      @include media-breakpoint-up(md) {
        padding: 0;
      }
      li + li {
        margin: 28px 0 0;
      }
    }
  }
}
</style>
