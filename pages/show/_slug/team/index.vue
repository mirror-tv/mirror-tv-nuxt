<template>
  <ArtShowWrapper
    currentSection="team"
    gaCategory="ArtShow_directorlist"
    :currentShow="currentShow"
    :showName="show.name"
    :picture="show.picture"
    :shouldShowNavbar="true"
    :sectionList="sectionList"
  >
    <ol class="team__list">
      <li v-for="member in members" :key="member.name">
        <a
          :href="`/show/${currentShow}/member/${member.slug}`"
          rel="noreferrer noopener"
        >
          <div class="team__list_image">
            <img
              :src="getHostImage(member)"
              :alt="member.name"
              @click="sendGaClickEvent('導演照片')"
            />
          </div>
        </a>
        <a
          :href="`/show/${currentShow}/member/${member.slug}`"
          rel="noreferrer noopener"
          @click="sendGaClickEvent('導演姓名')"
        >
          <h3 v-text="member.name" />
        </a>
      </li>
      <div class="position-correct" />
    </ol>
  </ArtShowWrapper>
</template>

<script>
import { SITE_NAME } from '~/constants'
import { getUrlOrigin } from '~/utils/meta'
import { sendGaEvent } from '~/utils/google-analytics'
import { getContactImageUrl } from '~/utils/image-handler'
import ArtShowWrapper from '~/components/ArtShowWrapper'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'
import { fetchSectionByShowSlug } from '~/apollo/queries/section.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.currentShow,
          rectHostImg: true,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
    sectionList: {
      query: fetchSectionByShowSlug,
      variables() {
        return {
          showSlug: this.currentShow,
        }
      },
      update: (data) => data.allSections || {},
    },
  },
  components: {
    ArtShowWrapper,
  },
  data() {
    return {
      show: {},
      sectionList: [],
    }
  },
  head() {
    const title = `創作團隊 - ${this.show.name} - ${SITE_NAME}`
    const image = this.show?.picture?.urlDesktopSized
    return {
      title,
      description: this.show.introduction,
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
        ...(this.show.introduction
          ? [
              {
                hid: 'description',
                name: 'description',
                content: this.show.introduction,
              },
              {
                hid: 'og:description',
                property: 'og:description',
                content: this.show.introduction,
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
    members() {
      return this.show.hostName ?? []
    },
  },
  methods: {
    getHostImage(member) {
      return getContactImageUrl(member)
    },
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('ArtShow_directorlist')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.team {
  &__list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 15px;
    &::after {
      content: '';
      width: calc((100% - 32px) / 2);
    }
    @include media-breakpoint-up(md) {
      margin-top: 48px;
      &::after {
        content: '';
        width: calc((100% - 72px) / 3);
      }
    }
    @include media-breakpoint-up(xl) {
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
        width: calc((100% - 72px) / 3);
        margin: 0 0 30px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
        margin: 0 0 50px;
      }
      div {
        overflow: hidden;
      }
      img {
        width: 100%;
        height: calc((100vw - 32px) / 2 * 0.5625);
        background: $color-grey;
        object-fit: cover;
        transform: scale(1, 1);
        transition: all 1s ease-out;
        @include media-breakpoint-up(md) {
          height: 141px;
        }
        @include media-breakpoint-up(md) {
          height: 144px;
        }
        &:hover {
          transform: scale(1.1);
        }
      }
      h3 {
        margin-top: 12px;
        font-size: 16px;
        line-height: 22px;
        @include media-breakpoint-up(md) {
          font-weight: 500;
          font-size: 20px;
          line-height: 28px;
          letter-spacing: 0.5px;
        }
      }
    }
    .position-correct {
      width: calc((100% - 32px) / 2);
      overflow: hidden;
      @include media-breakpoint-up(md) {
        width: calc((100% - 72px) / 3);
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 96px) / 4);
      }
    }
  }
}
</style>
