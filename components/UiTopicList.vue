<template>
  <div class="topic">
    <div class="topic__heading">
      <HeadingBordered class="heading" :text="title" />
      <a href="/topic" target="_blank" rel="noreferrer noopener">更多專題</a>
    </div>
    <section v-if="hasTopics" class="topic__list">
      <div
        v-for="topic in formatedTopics"
        :key="topic.slug"
        class="topic__list__item"
      >
        <a
          :href="`/topic/${topic.slug}`"
          target="_blank"
          rel="noreferrer noopener"
          class="topic__list__item__header"
        >
          <img :src="topic.image" :alt="topic.name" />
          <h4>{{ topic.name }}</h4>
        </a>
        <ul class="topic__list__item__list">
          <li v-for="item in topic.items" :key="item.slug">
            <a
              :href="`/story/${item.slug}`"
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>{{ item.title }}</span>
            </a>
          </li>
        </ul>
        <a
          :href="`/topic/${topic.slug}`"
          target="_blank"
          rel="noreferrer noopener"
          class="topic__list__item__btn"
        >
          看更多
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import { getPostImageUrl } from '~/utils/image-handler'

export default {
  components: {
    HeadingBordered,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    topics: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    formatedTopics() {
      return (
        this.topics?.map((topic) => {
          return {
            slug: topic.slug ?? '',
            name: topic.name ?? '',
            image: getPostImageUrl(topic),
            items: this.formatItems(topic.post),
          }
        }) ?? []
      )
    },
    hasTopics() {
      return this.formatedTopics?.length
    },
  },
  methods: {
    formatItems(post) {
      return (
        post?.map((item) => {
          return {
            title: item?.name ?? '',
            slug: item?.slug ?? '',
          }
        }) ?? []
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.topic {
  width: 100%;
  &__heading {
    margin: 0 0 28px;
    @include media-breakpoint-up(md) {
      margin: 0 0 32px;
    }
    .heading {
      min-width: 110px;
    }
    a {
      display: inline-block;
      font-size: 16px;
      line-height: 22px;
      color: $color-blue;
      margin: 0 0 4px 16px;
      border-bottom: 1px solid $color-blue;
    }
  }
  &__list {
    width: 100%;
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &__item {
      width: 100%;
      margin: 0 0 32px;
      @include media-breakpoint-up(md) {
        width: calc((100% - 48px) / 2);
      }
      &__header {
        display: block;
        width: 100%;
        img {
          width: 100%;
          height: calc((100vw - 32px) * 0.5625);
          object-fit: cover;
          object-position: center;
          margin: 0 0 16px;
          @include media-breakpoint-up(md) {
            height: calc((688px - 48px) / 2 * 0.666);
            margin: 0 0 8px;
          }
        }
        h4 {
          font-size: 16px;
          line-height: 22px;
          font-weight: 500;
          color: $color-blue;
          margin: 0 0 8px;
        }
      }
      &__list {
        margin: 0 0 16px;
        li {
          margin: 8px 0;
          border-bottom: 1px solid $color-grey-deep;
          a {
            display: inline-block;
            span {
              font-size: 16px;
              line-height: 22px;
              word-wrap: break-word;
              -webkit-line-clamp: 1;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
          }
        }
      }
      &__btn {
        display: inline-block;
        text-align: center;
        font-size: 16px;
        line-height: 22px;
        font-weight: 500;
        color: $color-grey-deep;
        padding: 4px 8px;
        border: 1px solid $color-grey-deep;
      }
      &:last-child {
        margin: 0;
      }
      &:nth-last-child(2) {
        @include media-breakpoint-up(md) {
          margin: 0;
        }
      }
    }
  }
}
</style>
