<template>
  <div class="show-list">
    <HeadingBordered class="heading" :text="title" />
    <div class="show-list__wrapper">
      <ShowCard
        v-for="show in shows"
        :key="show.slug"
        :slug="show.slug"
        :imageUrl="show.bannerImg"
        :isArtShow="show.isArtShow"
      />
    </div>
  </div>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import ShowCard from '~/components/ShowCard'

export default {
  components: {
    HeadingBordered,
    ShowCard,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    shows: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.show-list {
  .heading {
    margin: 0 0 20px;
    min-width: 110px;
  }
  &__wrapper {
    padding-bottom: 12px;
    @include media-breakpoint-up(md) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-bottom: 4px;
    }
  }
}
</style>
