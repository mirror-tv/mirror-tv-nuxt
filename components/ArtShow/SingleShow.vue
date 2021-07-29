<template>
  <section class="artshow__single">
    <main class="main">
      <div class="video">
        <YoutubeEmbedByIframeApi :videoId="videoId" />
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="introduction" v-html="introduction" />
    </main>
    <aside class="g-aside">
      <div class="director">
        <div class="director__info">
          <img
            src="~assets/img/image-default.png"
            alt="director image"
            class="director__info-img"
          />
          <h3>{{ directorName }}</h3>
        </div>
        <p class="director__intro">{{ directorIntro }}</p>
      </div>
    </aside>
  </section>
</template>

<script>
import YoutubeEmbedByIframeApi from '~/components/YoutubeEmbedByIframeApi'
export default {
  components: {
    YoutubeEmbedByIframeApi,
  },
  data() {
    return {
      show: {},
      introduction: `當集介紹：（300字）三營能話須說陸日別，
        無相可前人過會自動此以水年美調化為不全年加它聽人室入樂賽
        日，不實之。已主如真平心生是，候大德數畫車一當；黑長時他
        以型裡速經足起百母代！由下提位會看。關越力理國識的是從，
        風叫主地來標意然常組當的破童男天現生黨語不著代最；會於管
        ，到於位有權導。形二來民打義那今我而認。成心代溫決花天著
        際經陽經弟。收樓生他未方傳！財香明流樂節！那養機中視向門
        計服黃，約的度視福家那過戰人；本由顧春歌最，正子兒多然事
        ，小們他給經就過查知比燈流天多定事示樣父我的分它質起著值
        洋面整歡臺產來，微中紀要溫冷信料外越。知做價設年斷時經，
        時同間港理來環那、筆藝目的的象那我？長對時，縣外氣我快考
        地用知主黨英像人或我的四人動？後的燈在興作平！石內師報會
        更行活評、生國了童的算什風業花於於經來新香地高然名軍機半
        出？`,
      directorIntro: `（200字）海一那這技率。希在往排行，雄心
        友集關。題兩政是客小氣一戰環收不一站種我；天訴影通接得門
        處教布沒後案出來處座兒狀。活展老我，化四男路財；過這在研
        能世收員聯面花向三年中行線表中人的！農就小學房生供者小弟
        了一物風裡住有嚴交期理笑顯。的臺入回認動石同業行。絕只的
        人隨實完放就趣實心無他。第女說原：假靈會舉得，情不流輕有
        否不……禮是大母式巴那。吸的處化研又因我我所羅領得心起你家
        方一年他管入研國服大更！府方面必一、史任用作多跑長物建活
        作接望演他，大北小持接至境，然許卻與護行維。`,
      directorName: '王小明',
      videoId: 'BUXE8PD2GPA',
    }
  },
}
</script>

<style lang="scss" scoped>
.artshow__single {
  width: 100%;
  @include media-breakpoint-up(xl) {
    display: flex;
  }
  .main {
    margin: 24px auto 42px;
    .video {
      margin-bottom: 30px;
      width: calc(100% + 32px);
      transform: translateX(-16px);
      @include media-breakpoint-up(md) {
        width: 100%;
        transform: none;
        margin-bottom: 40px;
      }
    }
    .introduction {
      text-align: justify;
      color: $color-blue;
      font-weight: 500;
      font-size: 16px;
      line-height: 32px;
    }
    @include media-breakpoint-up(md) {
      margin: 28px 0 52px;
    }
    @include media-breakpoint-up(xl) {
      margin: 0;
      width: 800px;
    }
  }
  .g-aside {
    width: 100%;
    margin-bottom: 48px;
    .director {
      &__info {
        &-img {
          width: 142px;
          height: 142px;
          object-fit: cover;
          object-position: center;
          background-color: $color-grey;
          margin-bottom: 20px;
        }
        h3 {
          font-weight: 600;
          font-size: 20px;
          line-height: 32px;
          margin-bottom: 12px;
        }
      }
      &__intro {
        font-size: 13px;
        line-height: 27px;
        color: #4a4a4a;
      }
      @include media-breakpoint-up(md) {
        width: 100%;
        display: flex;
        &__info {
          min-width: 142px;
          margin-right: 37px;
          &-img {
            margin-bottom: 33px;
          }
          h3 {
            margin-bottom: 0;
          }
        }
      }
      @include media-breakpoint-up(xl) {
        display: block;
        &__info {
          min-width: 200px;
          margin-right: 37px;
          &-img {
            width: 200px;
            height: 200px;
            margin-bottom: 22px;
          }
          h3 {
            margin-bottom: 12px;
          }
        }
      }
    }
    @include media-breakpoint-up(xl) {
      width: 200px;
      margin-left: auto;
      padding: 0;
    }
  }
}
</style>
