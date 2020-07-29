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
        <button
          class="buttons-wrapper__search-button search-button"
          @click="handleClickSearchButton"
        >
          <img class="search-icon" src="~/assets/img/search.svg" alt="search" />
        </button>
      </div>
    </div>
    <div
      :class="[
        'search-form-wrapper-mobile',
        { 'search-form-wrapper-mobile--visible': showSearchFormWrapper }
      ]"
    >
      <HeaderSearchForm :placeholder="'輸入關鍵字'" />
    </div>
    <div
      :class="[
        'header__bottom-wrapper',
        'bottom-wrapper',
        { 'header__bottom-wrapper--hide': !showCategories }
      ]"
    >
      <nav class="bottom-wrapper__navs navs">
        <div
          v-for="category in allCategories"
          :key="`category-nav-${category.title}`"
          class="navs__category-nav category-nav"
        >
          <nuxt-link
            :to="`/category/${category.title}`"
            @click.native="closeHamburgerButton"
            v-text="truncate(category.title)"
          />
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import HeaderSearchForm from '~/components/HeaderSearchForm.vue'
import allCategories from '~/apollo/queries/allCategories.gql'

export default {
  apollo: {
    allCategories: {
      query: allCategories
    }
  },
  components: {
    HeaderSearchForm
  },
  data() {
    return {
      showCategories: false,
      showSearchFormWrapper: false
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
      if (this.showCategories === true) {
        this.showSearchFormWrapper = false
      }
    },
    closeHamburgerButton() {
      this.showCategories = false
    },
    handleClickSearchButton() {
      this.showSearchFormWrapper = !this.showSearchFormWrapper
      if (this.showSearchFormWrapper === true) {
        this.showCategories = false
      }
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
  &__search-button {
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

.search-form-wrapper-mobile {
  background-color: white;
  padding: 20px;
  display: none;
  &--visible {
    display: initial;
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
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
      margin: 0;
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
          @include separator_line;
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
