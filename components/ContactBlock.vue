<template>
  <div class="contact">
    <div class="left-container">
      <img :src="image" :alt="name" />
      <div v-if="hasSocialMedia" class="contact__social-media">
        <a
          v-if="facebook"
          :href="facebook"
          class="link"
          target="_blank"
          rel="noreferrer noopener"
          @click="sendGaClickEvent('author’s facebook')"
        >
          <img src="~/assets/img/facebook-logo-grey-58.png" alt="Facebook" />
        </a>
        <a
          v-if="instatgram"
          :href="instatgram"
          class="link"
          target="_blank"
          rel="noreferrer noopener"
          @click="sendGaClickEvent('author’s instagram')"
        >
          <img src="~/assets/img/IG-logo.svg" alt="Instatgram" />
        </a>
      </div>
    </div>
    <div class="right-container">
      <h1 v-if="name" class="contact__name" v-text="name" />
      <p v-if="profile" class="contact__profile" v-text="profile" />
    </div>
  </div>
</template>

<script>
import { sendGaEvent } from '~/utils/google-analytics'

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: require('~/assets/img/image-default.png'),
    },
    facebook: {
      type: String,
      default: '',
    },
    instatgram: {
      type: String,
      default: '',
    },
    profile: {
      type: String,
      default: '',
    },
  },
  computed: {
    hasSocialMedia() {
      return this.facebook || this.instatgram
    },
  },
  methods: {
    sendGaClickEvent(label) {
      sendGaEvent(this.$ga)('author')('click')(label)
    },
  },
}
</script>

<style lang="scss" scoped>
.contact {
  @include media-breakpoint-up(lg) {
    display: flex;
    .left-container {
      width: 100px;
    }
    .right-container {
      flex: 1;
      margin: 0 0 0 30px;
    }
  }
  img {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
    @include default-background-image;
  }
  &__name {
    margin: 30px auto 0;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    @include media-breakpoint-up(lg) {
      margin-top: 0;
      text-align: left;
    }
  }
  &__social-media {
    display: flex;
    justify-content: center;
    margin: 10px auto 0;
    .link {
      display: block;
      padding: 14px;
      img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        object-position: center center;
      }
    }
  }
  &__profile {
    margin: 10px 0 0;
    text-align: justify;
    line-height: 1.75;
  }
}
</style>
