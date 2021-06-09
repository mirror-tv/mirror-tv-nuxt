<template>
  <section class="g-page g-page--with-aside show">
    <div class="g-page__wrapper">
      <h1 class="show__name" v-text="showName" />
      <picture v-if="picture" class="show__banner-image">
        <source :srcset="picture.urlDesktopSized" media="(min-width: 768px)" />
        <img :src="picture.urlMobileSized" :alt="showName" />
      </picture>
      <ArtShowBreadCrum />
      <section class="artshow__director">
        <HeadingBordered
          v-if="!isMobile"
          :text="directorInfo.name"
          class="artshow__director__name"
        />
        <div class="artshow__director__info">
          <img src="~assets/img/image-default.png" :alt="directorInfo.name" />
          <HeadingBordered
            v-if="isMobile"
            :text="directorInfo.name"
            class="artshow__director__info-name"
          />
          <p>{{ directorInfo.intro }}</p>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import HeadingBordered from '~/components/HeadingBordered'
import ArtShowBreadCrum from '~/components/ArtShowBreadCrum'
import { fetchShowBySlug } from '~/apollo/queries/show.gql'

export default {
  apollo: {
    show: {
      query: fetchShowBySlug,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
      update: (data) => data.allShows?.[0] || {},
    },
  },
  components: {
    HeadingBordered,
    ArtShowBreadCrum,
  },
  data() {
    return {
      isMobile: false,
      directorInfo: {
        name: '王小明',
        intro: `發海一那發這技率。希在往哈排行社測眼，
          雄心友集關。題兩政是客小氣一戰環收不一站種我；
          天訴影通接得門處教布沒後案出來處座兒狀。活展老
          我，化四男路財；過這在研能世收員聯面花向三年中
          行線表中人的！農就小學房生供者小弟了一物風裡住
          有嚴交期理笑顯。的臺入回認動石同業行。絕只的人
          隨實完放就趣實心無他。第女說原：假靈會舉得，情
          不流輕有否不……禮是大母式巴那。吸的處化研又因我
          我所羅領得心起你家方一年他管入研國服大更！府方
          面必一、史任用作多跑長物建活作接望演他，大北小
          持接至境，然許卻與護行維。`,
      },
      showList: [
        { id: 'BUXE8PD2GPA', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'dSwrzQ_IC-c', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'o51cN-oxm0o', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: 'M80b1NEnkaM', title: '栽在他手上特偵名檢', img: 'tt' },
        { id: '-vPm2G_EIb0', title: '栽在他手上特偵名檢', img: 'tt' },
        // { id: 'qqCNEFk0tx0', title: '栽在他手上特偵名檢', img: 'tt' },
        // { id: 'OamEy6MbC7s', title: '栽在他手上特偵名檢', img: 'tt' },
      ],
    }
  },
  computed: {
    currentSlug() {
      return this.$route.params.slug ?? ''
    },
    showName() {
      return this.show.name ?? ''
    },
    picture() {
      return this.show.picture
    },
  },
  mounted() {
    this.detectViewport()
  },
  methods: {
    detectViewport() {
      const viewportWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      if (viewportWidth < 768) {
        this.isMobile = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.show {
  &.g-page {
    @include media-breakpoint-up(sm) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
  &.g-page--with-aside {
    .g-page__wrapper {
      max-width: 688px;
      @include media-breakpoint-up(xl) {
        max-width: 1120px;
        display: flex;
        flex-wrap: wrap;
      }
      @include media-breakpoint-up(xxl) {
        max-width: 1200px;
      }
    }
  }
  &__name {
    color: $color-blue;
    font-size: 20px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0.5px;
    margin: 24px 0;
    @include media-breakpoint-up(md) {
      width: 100%;
      font-size: 30px;
      line-height: 42px;
    }
  }
  &__banner-image {
    position: relative;
    display: block;
    width: calc(100% + 32px);
    margin: 18px auto 0;
    padding-top: 37.5%;
    transform: translateX(-16px);
    @include media-breakpoint-up(md) {
      width: 100%;
      margin: 9px auto 34px;
      transform: none;
    }
    @include media-breakpoint-up(xl) {
      margin: 24px auto 34px;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}
.artshow {
  &__director {
    width: 100%;
    margin-bottom: 55px;
    @include media-breakpoint-up(md) {
      margin-bottom: 45px;
    }
    @include media-breakpoint-up(xl) {
      margin-bottom: 75px;
    }
    &__name {
      width: 130px;
      @include media-breakpoint-up(md) {
        margin-bottom: 26px;
      }
    }
    &__info {
      width: 100%;
      @include media-breakpoint-up(md) {
        display: flex;
        flex-direction: row-reverse;
      }
      img {
        width: 100%;
        height: calc(100vw - 32px);
        object-fit: cover;
        object-position: center;
        background-color: $color-grey;
        margin-bottom: 24px;
        @include media-breakpoint-up(md) {
          width: 215px;
          height: 215px;
          margin: 0 0 0 32px;
        }
        @include media-breakpoint-up(md) {
          margin: 0 0 0 92px;
        }
      }
      p {
        font-weight: 500;
        font-size: 16px;
        line-height: 32px;
        color: $color-blue;
      }
      &-name {
        width: 130px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>
