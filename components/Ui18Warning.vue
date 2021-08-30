<template>
  <div v-if="shouldShowModal" class="warning-modal">
    <div class="warning-modal__container">
      <div class="warning-modal__modal">
        <h2>
          <span>您即將進入之內容</span>
          <span>需滿十八歲方可瀏覽</span>
        </h2>
        <p>
          根據「電腦網路內容分級處理辦法」第六條第三款規定，本網站已於各限制級網頁依照台灣網站分級推廣基金會之規定標示。若您尚未年滿十八歲，請點選離開。若您已滿十八歲，亦不可將本區之內容派發、傳閱、出售、出租、交給或借予年齡未滿18歲的人士瀏覽，或將本網站內容向該人士出示、播放或放映。
        </p>
        <div class="warning-modal__btns">
          <button
            type="button"
            class="warning-modal__btns-confirm"
            @click="handleConfirm"
          >
            是，我已滿 18 歲
          </button>
          <button
            type="button"
            class="warning-modal__btns-reject"
            @click="handleReject"
          >
            離開
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'vue-cookie'

export default {
  data() {
    return {
      shouldShowModal: true,
    }
  },
  mounted() {
    if (window) {
      document.body.style.overflow = 'hidden'
    }
  },
  methods: {
    handleConfirm() {
      document.body.style.overflow = 'auto'
      Cookie.set('article-confirmedAdult', true, { expires: '30m' })
      this.shouldShowModal = false
    },
    handleReject() {
      document.body.style.overflow = 'auto'
      window.location.replace('/')
    },
  },
}
</script>

<style lang="scss" scoped>
.warning-modal {
  &__container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 100px 20px 0;
    background-color: rgba(7, 7, 7, 0.95);
    z-index: 1000;
  }
  &__modal {
    max-width: 600px;
    border-radius: 10px;
    background-color: #fff;
    padding: 24px 20px 20px;
    margin: 0 auto;
    @include media-breakpoint-up(md) {
      padding: 20px 68px 32px;
    }
    h2 {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      text-align: center;
      color: $color-blue;
      margin: 0 0 16px;
      @include media-breakpoint-up(md) {
        font-size: 30px;
        line-height: 42px;
        margin: 0 0 24px;
      }
      span {
        display: inline-block;
        width: 100%;
      }
    }
    p {
      font-size: 14px;
      line-height: 20px;
      margin: 0 0 16px;
      @include media-breakpoint-up(md) {
        font-size: 16px;
        line-height: 1.8;
        margin: 0 0 24px;
      }
    }
  }
  &__btns {
    display: block;
    @include media-breakpoint-up(md) {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &-confirm {
      width: 100%;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 3px;
      text-align: center;
      color: $color-blue;
      border: 1px solid $color-blue;
      padding: 8px;
      margin: 0 0 8px;
      @include media-breakpoint-up(md) {
        margin: 0;
        width: 313px;
      }
      &:hover {
        padding: 7px 0;
        border: 2px solid $color-blue;
      }
      &:focus,
      &:active {
        outline: none;
        padding: 7px 0;
        border: 2px solid $color-blue;
        background-color: rgba(0, 77, 188, 0.05);
      }
    }
    &-reject {
      width: 100%;
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      letter-spacing: 3px;
      text-align: center;
      color: #4a4a4a;
      border: 1px solid #d8d8d8;
      padding: 8px;
      @include media-breakpoint-up(md) {
        width: 131px;
      }
      &:hover {
        padding: 7px 0;
        border: 2px solid #4a4a4a;
      }
      &:focus,
      &:active {
        outline: none;
        padding: 7px 0;
        border: 2px solid #4a4a4a;
        background-color: rgba(155, 155, 155, 0.05);
      }
    }
  }
}
</style>
