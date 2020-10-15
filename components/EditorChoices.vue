<template>
  <div v-if="hasItems" class="editor-choices">
    <slot />
    <div class="editor-choices-container">
      <a
        :href="`/story/${firstItem.slug}`"
        class="editor-choices__first-item item"
        target="_blank"
        rel="noopener noreferrer"
      >
        <picture>
          <img
            :src="firstItem.heroImage.urlMobileSized"
            :alt="firstItem.title"
          />
        </picture>
        <span v-text="firstItem.title" />
      </a>
      <div class="editor-choices__remaining">
        <a
          v-for="item in remainingItems"
          :key="item.slug"
          :href="`/story/${item.slug}`"
          class="item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <picture>
            <img :src="item.heroImage.urlMobileSized" :alt="item.title" />
          </picture>
          <span v-text="firstItem.title" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditorChoices',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    firstItem() {
      return this.items.slice(0, 1)[0]
    },
    hasItems() {
      return this.items.length > 0
    },
    remainingItems() {
      return this.items.slice(1)
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-choices {
  &-container {
    @include media-breakpoint-up(xl) {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
  }
  &__first-item {
    position: relative;
    left: -20px;
    width: calc(100% + 40px);
    margin: 20px 0 0;
    @include media-breakpoint-up(xl) {
      position: static;
      width: 633px;
    }
    span {
      padding: 20px;
      color: #fff;
      background-color: #014db8;
    }
  }
  &__remaining {
    padding: 20px 0;
    border-bottom: 1px solid #d8d8d8;
    @include media-breakpoint-up(xl) {
      flex: 1;
      margin: 0 0 0 20px;
      border: none;
    }
    .item {
      display: flex;
      picture {
        width: 120px;
        padding-top: calc(120px * 0.6666);
      }
      span {
        flex: 1;
        margin-left: 10px;
        color: #4a4a4a;
        font-size: 14px;
        line-height: 1.29;
        text-align: justify;
      }
    }
  }
}

.item {
  display: block;
  picture {
    display: block;
    position: relative;
    padding-top: 66.66%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center center;
    }
  }
  span {
    display: block;
  }
}
</style>
