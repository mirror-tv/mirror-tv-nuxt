<template>
  <ul class="artshow__host-list" :class="{ 'fixed-width': shouldWidthFixed }">
    <li v-for="host in formatedHostList" :key="host.slug">
      <a :href="host.href" rel="noreferrer noopener" target="_blank">
        <div class="image">
          <img :src="host.image" :alt="host.name" />
        </div>
        <h3>
          <span>{{ host.name }}</span>
        </h3>
      </a>
    </li>
    <div class="position-correct" />
  </ul>
</template>

<script>
import { getContactImageUrl } from '~/utils/image-handler'

export default {
  props: {
    hostList: {
      type: Array,
      default: () => [],
      required: true,
    },
    shouldWidthFixed: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formatedHostList() {
      return this.hostList?.map((host) => {
        const { slug = '', name = '' } = host || {}

        return {
          slug,
          name,
          href: `/show/${this.currentShow}/host/${slug}`,
          image: getContactImageUrl(host),
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.artshow__host-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  &::after {
    content: '';
  }
  li,
  .position-correct,
  &::after {
    width: calc((100% - 32px) / 3);
    margin: 0 0 16px;
    @include media-breakpoint-up(xl) {
      width: calc((100% - 84px) / 4);
      margin: 0 0 18px;
    }
  }
  li {
    a {
      .image {
        width: 100%;
        position: relative;
        padding-top: 100%;
        overflow: hidden;
        margin: 0 0 8px;
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }
      }
      h3 {
        span {
          display: inline;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
          color: $color-blue;
          @include media-breakpoint-up(xl) {
            font-size: 16px;
          }
          &:hover {
            border-bottom: 2px solid $color-blue;
          }
        }
      }
    }
  }
  &.fixed-width {
    justify-content: start;
    li,
    .position-correct,
    .artshow__host-list::after {
      width: 85px;
      margin: 0 0 16px;
      @include media-breakpoint-up(xl) {
        width: 128px;
        margin: 0 0 18px;
      }
    }
    li + li {
      margin-left: 28px;
    }
  }
}
</style>
