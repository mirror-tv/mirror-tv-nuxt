<template>
  <header class="header">
    <div class="header__top-wrapper top-wrapper">
      <nuxt-link class="logo" to="/">
        <picture>
          <source
            media="(min-width: 1200px)"
            srcset="~/assets/img/Mnews_Logo-b.svg"
          />
          <img src="~/assets/img/Mnews_Logo_mobile-white.svg" alt="logo" />
        </picture>
      </nuxt-link>
      <HeaderSearchForm class="top-wrapper__search-form" />
      <div class="top-wrapper__buttons-wrapper buttons-wrapper">
        <button
          :class="[
            'hamburger-button',
            { 'hamburger-button--rotated': showCategories }
          ]"
          @click="handleClickHamburgerButton"
        >
          <span class="hamburger-icon" />
        </button>
        <button class="buttons-wrapper__search">
          <img class="search-icon" src="~/assets/img/search.svg" alt="search" />
        </button>
      </div>
    </div>
    <div
      :class="[
        'header__bottom-wrapper',
        'bottom-wrapper',
        { 'header__bottom-wrapper--hide': !showCategories }
      ]"
    >
      <div class="bottom-wrapper__navs navs">
        <nav
          v-for="category in categories"
          :key="`category-nav-${category}-1`"
          class="navs__category-nav category-nav"
        >
          <nuxt-link
            :to="`/category/${category}`"
            v-text="truncate(category)"
          />
        </nav>
        <nav
          v-for="category in categories"
          :key="`category-nav-${category}-2`"
          class="navs__category-nav category-nav"
        >
          <nuxt-link
            :to="`/category/${category}`"
            v-text="truncate(category)"
          />
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import HeaderSearchForm from '~/components/HeaderSearchForm.vue'

export default {
  components: {
    HeaderSearchForm
  },
  data() {
    return {
      showCategories: false
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories
    }
  },
  methods: {
    handleClickHamburgerButton() {
      this.showCategories = !this.showCategories
    },
    truncate(text) {
      return text.substring(0, 5)
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 9999;
  display: flex;
  flex-direction: column;
  &__bottom-wrapper {
    &--hide {
      display: none;
      @include media-breakpoint-up(xl) {
        display: block;
      }
    }
  }
}

.top-wrapper {
  height: 50px;
  background-color: #003366;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__search-form {
    display: none;
  }
  @include media-breakpoint-up(xl) {
    padding-left: calc((100vw - 1000px) / 2);
    padding-right: calc((100vw - 1000px) / 2);
    height: 80px;
    background-color: white;
    &__search-form {
      display: flex;
    }
  }
}

.logo {
  img {
    width: 100px;
    @include media-breakpoint-up(xl) {
      width: 200px;
    }
  }
}

.buttons-wrapper {
  display: flex;
  align-items: center;
  &__search {
    margin: 0 0 0 20px;
  }
  @include media-breakpoint-up(xl) {
    display: none;
  }
}

.hamburger-button {
  transition: transform 0.25s ease-out;
  &--rotated {
    transform: rotate(90deg);
  }
}

.hamburger-icon {
  width: 28px;
  height: 25px;
  border-top: 3px solid white;
  border-bottom: 3px solid white;
  display: flex;
  align-items: center;
  &:before {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background-color: white;
  }
}

.search-icon {
  height: 30px;
}

.bottom-wrapper {
  background-color: #1eb1e6;
  /*padding: 30px 40px;*/
  @include media-breakpoint-up(xl) {
    /*padding: 0;*/
    padding-left: calc((100vw - 1000px) / 2);
    padding-right: calc((100vw - 1000px) / 2);
    height: 37px;
    background-color: #003366;
    display: flex;
    align-items: center;
  }
}

.navs {
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  /*margin-bottom: calc(30px - 32px);*/
  margin-left: calc((100vw - 81px * 3) / 2);
  margin-right: calc((100vw - 81px * 3) / 2);
  @include media-breakpoint-between(md, lg) {
    margin-left: calc((100vw - 81px * 4) / 2);
    margin-right: calc((100vw - 81px * 4) / 2);
  }
  @include media-breakpoint-between(lg, xl) {
    margin-left: calc((100vw - 81px * 6) / 2);
    margin-right: calc((100vw - 81px * 6) / 2);
  }
  @include media-breakpoint-up(xl) {
    margin: 0;
    height: 100%;
    align-items: center;
  }
  &__category-nav {
    margin: 0 0 32px 0;

    @mixin separator_line() {
      content: '';
      display: inline-block;
      width: 2px;
      height: 16px;
      background-color: white;
    }
    &:before {
      @include separator_line;
    }
    &:last-child,
    &:nth-child(3n) {
      &:after {
        @include separator_line;
      }
    }
    @include media-breakpoint-between(md, lg) {
      &:nth-child(3n) {
        &:after {
          display: none;
        }
      }
      &:nth-child(4n) {
        &:after {
          @include separator_line;
        }
      }
    }
    @include media-breakpoint-between(lg, xl) {
      &:nth-child(3n),
      &:nth-child(4n) {
        &:after {
          display: none;
        }
      }
      &:nth-child(6n) {
        &:after {
          @include separator_line;
        }
      }
    }
    @include media-breakpoint-up(xl) {
      &:nth-child(3n),
      &:nth-child(4n),
      &:nth-child(6n) {
        &:after {
          display: none;
        }
      }
      &:before {
        background-color: #979797;
      }
      &:last-child {
        &:after {
          background-color: #979797;
        }
      }
    }
  }

  .category-nav {
    height: 100%;
    color: white;
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.15s ease-out, box-shadow 0.15s ease-out;
    &:hover {
      border-bottom: 2px solid transparent;
      box-shadow: none;
    }
    a {
      padding: 0 24px;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    @include media-breakpoint-up(xl) {
      &:hover {
        border-bottom: 2px solid #ffcc01;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      }
      a {
        padding: 0 15px;
      }
    }
  }
}
</style>
