<template>
  <div v-if="hasItems" class="editor-choices">
    <slot />
    <div class="editor-choices-container">
      <a
        :href="`/story/${firstItem.slug}`"
        class="editor-choices__first-item item"
        target="_blank"
        rel="noopener noreferrer"
        @click="$emit('click')"
      >
        <picture>
          <img :src="getImage(firstItem)" :alt="firstItem.title" />
        </picture>
        <span v-text="firstItem.title" />
      </a>
      <div class="editor-choices__remaining">
        <div class="scrollable-container">
          <a
            v-for="item in remainingItems"
            :key="item.slug"
            :href="`/story/${item.slug}`"
            class="item"
            target="_blank"
            rel="noopener noreferrer"
            @click="$emit('click')"
          >
            <picture>
              <img :src="getImage(item)" :alt="item.title" />
            </picture>
            <span v-text="firstItem.title" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  methods: {
    getImage(item) {
      return item.heroImage?.urlMobileSized
    },
  },
}
</script>

<style lang="scss" scoped>
.editor-choices {
  @include media-breakpoint-up(xl) {
    width: 100%;
  }
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
      position: relative;
      flex: 1;
      margin: 20px 0 0 20px;
      padding: 0;
      border: none;
      overflow: hidden;
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
  .scrollable-container {
    @include media-breakpoint-up(xl) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
  }
}

.item {
  display: block;
  + .item {
    margin-top: 16px;
  }
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
