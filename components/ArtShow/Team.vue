<template>
  <ol class="team__list">
    <li v-for="member in members" :key="member.name">
      <a :href="`/show/${currentShow}/director/tt`" rel="noreferrer noopener">
        <img v-if="member.image" :src="member.image" :alt="member.name" />
        <img v-else src="~assets/img/image-default.png" :alt="member.name" />
      </a>
      <h3 v-text="member.name" />
    </li>
    <div class="position-correct" />
  </ol>
</template>

<script>
export default {
  props: {
    currentShow: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      members: [
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
        { name: '王小明', image: '' },
      ],
    }
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
        width: calc((100% - 192px) / 4);
      }
    }
    li {
      text-align: center;
      width: calc((100% - 32px) / 2);
      margin: 0 0 24px;
      @include media-breakpoint-up(md) {
        text-align: left;
        width: calc((100% - 72px) / 3);
        margin: 0 0 30px;
      }
      @include media-breakpoint-up(xl) {
        width: calc((100% - 192px) / 4);
        margin: 0 0 50px;
      }
      img {
        width: 100%;
        height: calc((100vw - 64px) / 2 * 0.56);
        background: lightgray;
        object-fit: cover;
        @include media-breakpoint-up(md) {
          height: 141px;
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
        width: calc((100% - 192px) / 4);
      }
    }
  }
}
</style>
