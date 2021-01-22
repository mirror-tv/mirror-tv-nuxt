<template>
  <header class="header">
    <div class="header__top-wrapper top-wrapper">
      <nuxt-link
        class="logo"
        to="/"
        @click.native="sendGaClickEvent('mnews logo')"
      >
        <picture>
          <source
            media="(min-width: 1200px)"
            srcset="~/assets/img/Mnews_Logo-b.svg"
          />
          <img src="~/assets/img/Mnews_Logo_mobile-white.svg" alt="logo" />
        </picture>
      </nuxt-link>
      <HeaderSearchForm
        class="top-wrapper__search-form"
        :input.sync="searchKeyword"
        @submit="handleSearchFormSubmit"
      />
      <div class="top-wrapper__buttons-wrapper buttons-wrapper">
        <button
          :class="[
            'hamburger-button',
            { 'hamburger-button--rotated': showCategories },
          ]"
          aria-label="hamburger-button"
          @click="handleClickHamburgerButton"
        >
          <span class="hamburger-icon" />
        </button>
        <button
          :class="[
            'buttons-wrapper__search-button',
            'search-button',
            { 'search-button--translucent': showSearchFormWrapper },
          ]"
          @click="handleClickSearchButton"
        >
          <img class="search-icon" src="~/assets/img/search.svg" alt="search" />
        </button>
      </div>
    </div>
    <div
      :class="[
        'search-form-wrapper-mobile',
        {
          'search-form-wrapper-mobile--visible': showSearchFormWrapper,
        },
      ]"
    >
      <HeaderSearchForm
        :placeholder="'輸入關鍵字'"
        :input.sync="searchKeyword"
        @submit="handleSearchFormSubmit"
      />
      <div
        v-show="!isCurrentPageOnSearch"
        class="search-form-wrapper-mobile__dimmed-background"
        @click="handleCloseSearchButton"
      />
    </div>
    <div
      :class="[
        'header__bottom-wrapper',
        'bottom-wrapper',
        { 'header__bottom-wrapper--hide': !showCategories },
      ]"
    >
      <nav class="bottom-wrapper__navs navs">
        <div
          v-for="category in allCategories"
          :key="`category-nav-${category.slug}`"
          class="navs__category-nav category-nav"
        >
          <nuxt-link
            class="category-nav__link"
            :to="`/category/${category.slug}`"
            @click.native="closeHamburgerButton"
            v-text="truncate(category.name)"
          />
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { fetchFeaturedCategories } from '~/apollo/queries/categories.gql'
import { sendGaEvent } from '~/utils/google-analytics'
import HeaderSearchForm from '~/components/HeaderSearchForm.vue'

export default {
  name: 'Header',
  apollo: {
    allCategories: {
      query: fetchFeaturedCategories,
    },
  },
  components: {
    HeaderSearchForm,
  },
  data() {
    return {
      showCategories: false,
      showSearchFormWrapper: this.$route.name === 'search-keyword',
      searchKeyword: this.$route.params.keyword,
    }
  },
  computed: {
    categories() {
      return this.$store.state.categories
    },
    isCurrentPageOnSearch() {
      return this.$route.name === 'search-keyword'
    },
  },
  watch: {
    '$route.fullPath'() {
      const isSearchPage = this.$route.fullPath.match(/^\/search\//gs)
      if (!isSearchPage) {
        this.searchKeyword = ''
      }
    },
  },
  methods: {
    sendGaClickEvent(eventLabel) {
      return sendGaEvent(this.$ga)('header')('click')(eventLabel)
    },
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
    handleCloseSearchButton() {
      this.showSearchFormWrapper = false
    },
    truncate(text) {
      return text.substring(0, 5)
    },
    handleSearchFormSubmit() {
      if (this.searchKeyword) {
        this.$router.push(`/search/${this.searchKeyword}`)
      }
      this.sendGaClickEvent('search')
    },
  },
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
  background-color: $color-blue-deep;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__search-form {
    display: none;
  }
  @include media-breakpoint-up(xl) {
    width: $max-width-xxl;
    padding: 0;
    margin: 0 auto;
    height: 80px;
    background-color: #fff;
    &__search-form {
      display: flex;
    }
  }
}

.logo {
  padding: 9px 0;
  @include media-breakpoint-up(xl) {
    padding: 6px 0;
  }
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
    margin: 0 0 0 1.5px;
  }
  @include media-breakpoint-up(xl) {
    display: none;
  }
}

.hamburger-button {
  padding: 11.5px 10px;
  transition: transform 0.25s ease-out;
  &--rotated {
    transform: rotate(90deg);
  }
}

.hamburger-icon {
  width: 28px;
  height: 25px;
  border-top: 3px solid #fff;
  border-bottom: 3px solid #fff;
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 3px;
    background-color: #fff;
  }
}

.search-button {
  padding: 9px 8.5px;
  &--translucent {
    opacity: 0.3;
  }
}

.search-icon {
  height: 30px;
}

.search-form-wrapper-mobile {
  background-color: $color-grey;
  padding: 20px;
  display: none;
  &--visible {
    display: initial;
    @include media-breakpoint-up(xl) {
      display: none;
    }
  }
  &__dimmed-background {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: -1;
  }
}

.bottom-wrapper {
  background-color: #1eb1e6;
  @include media-breakpoint-up(xl) {
    padding-left: calc((100% - #{$max-width-xxl}) / 2);
    padding-right: calc((100% - #{$max-width-xxl}) / 2);
    background-color: $color-blue-deep;
  }
}

.navs {
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  margin-left: calc((100% - 81px * 3) / 2);
  margin-right: calc((100% - 81px * 3) / 2);
  @include media-breakpoint-between(md, lg) {
    margin-left: calc((100% - 81px * 4) / 2);
    margin-right: calc((100% - 81px * 4) / 2);
  }
  @include media-breakpoint-between(lg, xl) {
    margin-left: calc((100% - 81px * 6) / 2);
    margin-right: calc((100% - 81px * 6) / 2);
  }
  @include media-breakpoint-up(xl) {
    margin: 0;
  }
  &__category-nav {
    margin: 0 0 32px 0;

    @mixin separator_line() {
      content: '';
      display: inline-block;
      width: 2px;
      height: 16px;
      background-color: #fff;
    }
    &::before {
      @include separator_line;
    }
    &:last-child,
    &:nth-child(3n) {
      &::after {
        @include separator_line;
      }
    }
    @include media-breakpoint-between(md, lg) {
      &:nth-child(3n) {
        &::after {
          display: none;
        }
      }
      &:nth-child(4n) {
        &::after {
          @include separator_line;
        }
      }
      &:last-child {
        &::after {
          @include separator_line;
        }
      }
    }
    @include media-breakpoint-between(lg, xl) {
      &:nth-child(3n),
      &:nth-child(4n) {
        &::after {
          display: none;
        }
      }
      &:nth-child(6n) {
        &::after {
          @include separator_line;
        }
      }
      &:last-child {
        &::after {
          @include separator_line;
        }
      }
    }
    @include media-breakpoint-up(xl) {
      margin: 0;
      &:nth-child(3n),
      &:nth-child(4n),
      &:nth-child(6n) {
        &::after {
          display: none;
        }
      }
      &::before {
        background-color: $color-grey-deep;
      }
      &:last-child {
        &::after {
          @include separator_line;

          background-color: $color-grey-deep;
        }
      }
    }
  }

  .category-nav {
    color: #fff;
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.15s ease-out, box-shadow 0.15s ease-out;
    &:hover {
      border-bottom: 2px solid transparent;
      box-shadow: none;
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

  .category-nav__link {
    padding: 0 10px;
    font-size: 14px;
    letter-spacing: 0.5px;
    width: 77px;
    height: 28px;
    line-height: 28px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 35px;
      line-height: 35px;
    }
  }
}
</style>
