<template functional>
  <footer class="footer">
    <div class="footer__top-wrapper top-wrapper">
      <div class="top-wrapper__left left">
        <img class="logo" src="~/assets/img/Mnews_Logo_white.svg" alt="" />
        <nav
          class="left__social-network-services-nav social-network-services-nav"
        >
          <a href="" target="_blank" rel="noreferrer noopener">
            <img
              class="social-network-service-img"
              src="~/assets/img/facebook-logo-white-58.png"
              alt="facebook"
            />
          </a>
          <a
            class="social-network-services line"
            href=""
            target="_blank"
            rel="noreferrer noopener"
          >
            <img
              class="social-network-service-img"
              src="~/assets/img/LINE_logo.png"
              alt="line"
            />
          </a>
          <a href="" target="_blank" rel="noreferrer noopener">
            <img
              class="social-network-service-img"
              src="~/assets/img/IG-logo.svg"
              alt="instagram"
            />
          </a>
        </nav>
      </div>
      <div class="top-wrapper__middle middle">
        <div class="info-wrapper">
          <p class="info-wrapper__info">
            <span>客服專線：</span>
            <span>(02)7752-5678</span>
          </p>
          <p class="info-wrapper__info">
            <span>外部公評人特別申訴信箱：</span>
            <a href="mailto:NewsOmbudsman@mnews.tw" rel="noreferrer noopener">
              NewsOmbudsman@mnews.tw
            </a>
          </p>
        </div>
      </div>
      <div class="top-wrapper__right right">
        <a href="/schedule" target="_blank" rel="noreferrer noopener"
          >電視節目表</a
        >
        <a href="/aboutus">關於我們</a>
        <a href="/privacy">隱私權政策</a>
      </div>
    </div>
    <div class="footer__bottom-wrapper bottom-wrapper">
      <div class="icons">
        <a
          class="icons__readr"
          href="https://www.readr.tw"
          target="_blank"
          rel="noreferer noopener"
        >
          <img
            class="mirror-img"
            src="~/assets/img/READrlogo-01.svg"
            alt="readr"
          />
        </a>
        <a
          class="icons__mirror-media"
          href="https://www.mirrormedia.mg"
          target="_blank"
          rel="noreferer noopener"
        >
          <img
            class="mirror-img"
            src="~/assets/img/鏡mirrormedia-RGB.svg"
            alt="mirror-media"
          />
        </a>
        <a
          class="icons__mirror-fiction"
          href="https://www.mirrorfiction.com"
          target="_blank"
          rel="noreferer noopener"
        >
          <img
            class="mirror-img"
            src="~/assets/img/mirrorfiction.png"
            alt="mirror-fiction"
          />
        </a>
        <a
          class="icons__mirror-voice"
          href="https://voice.mirrorfiction.com"
          target="_blank"
          rel="noreferer noopener"
        >
          <img
            class="mirror-img"
            src="~/assets/img/mirrorvoice.png"
            alt="mirror-voice"
          />
        </a>
      </div>
      <div class="bottom-wrapper__texts texts">
        <p class="copyright">
          <span>©Mirror TV BROCASTING LTD.</span>
          <span>All Rights Reserved.</span>
          <span>鏡新聞股份有限公司 版權所有</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
}
</script>

<style lang="scss" scoped>
.top-wrapper {
  background-color: $color-blue;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(xl) {
    padding: 22px 0;
    padding-left: calc((100vw - #{$max-width-xxl}) / 2);
    padding-right: calc((100vw - #{$max-width-xxl}) / 2);
    flex-direction: row;
    align-items: center;
    position: relative;
  }
  &__middle {
    margin: 30px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 30px;
    }
  }
  &__right {
    margin: 30px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 30px;
      position: absolute;
      right: calc((100vw - #{$max-width-xxl}) / 2);
      height: calc(100% - 22px * 2);
    }
  }
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 200px;
}

.social-network-services-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  a {
    padding: 14px;
  }
}
.social-network-services {
  &.line {
    padding: 18px 7.5px;
  }
}

.social-network-service-img {
  opacity: 0.6;
  &[alt='facebook'],
  &[alt='instagram'] {
    height: 20px;
  }
  &[alt='line'] {
    height: 12px;
  }
}

.info-wrapper {
  color: white;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.5px;
  @include media-breakpoint-up(xl) {
    display: flex;
  }
  &__info {
    @include media-breakpoint-up(xl) {
      & + & {
        margin: 0 0 0 5px;
      }
    }
  }
}

.right {
  padding: 30px 0 0 0;
  border-top: 1px solid white;
  display: flex;
  flex-direction: column;
  color: white;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.5px;
  @include media-breakpoint-up(xl) {
    padding: 0 0 0 30px;
    border-top: none;
    border-left: 1px solid white;
  }
}

.bottom-wrapper {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  &__texts {
    margin: 30px 0 0 0;
  }
}

.icons {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    flex-direction: row;
  }
  &__readr {
    padding: 5.5px;
    @include media-breakpoint-up(xl) {
      order: 4;
      margin: 0 0 0 16px;
    }
  }
  &__mirror-media {
    margin: 4.5px 0 0 0;
    @include media-breakpoint-up(xl) {
      order: 1;
      margin: 0;
      padding: 2px 0;
    }
  }
  &__mirror-fiction,
  &__mirror-voice {
    margin: 7px 0 0 0;
    padding: 9px 0;
    @include media-breakpoint-up(xl) {
      margin: 0 0 0 16px;
      padding: 5.5px 0;
    }
  }
  &__mirror-fiction {
    @include media-breakpoint-up(xl) {
      order: 2;
    }
  }
  &__mirror-voice {
    @include media-breakpoint-up(xl) {
      order: 3;
    }
  }
}

.mirror-img {
  &[alt='readr'] {
    width: 37px;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 37px;
    }
  }
  &[alt='mirror-media'] {
    width: 133px;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 44px;
    }
  }
  &[alt='mirror-fiction'] {
    width: 133px;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 37px;
    }
  }
  &[alt='mirror-voice'] {
    width: 133px;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 37px;
    }
  }
}

.copyright {
  color: $color-blue;
  font-size: 14px;
  line-height: 2;
  letter-spacing: 0.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    color: $color-blue-deep;
    flex-direction: row;
    span + span {
      margin: 0 0 0 5px;
    }
  }
}
</style>
