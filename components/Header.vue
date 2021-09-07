<template>
  <header class="header">
    <div class="header__top-wrapper top-wrapper">
      <a
        href="/"
        rel="noreferrer noopener"
        class="logo"
        @click="sendGaClickEvent('mnews logo')"
      >
        <picture>
          <source
            media="(min-width: 768px)"
            srcset="~/assets/img/Mnews_Logo-b.svg"
          />
          <img src="~/assets/img/Mnews_Logo_mobile-white.svg" alt="logo" />
        </picture>
      </a>
      <section class="top-wrapper__right">
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
            <img
              class="search-icon"
              src="~/assets/img/search.svg"
              alt="search"
            />
          </button>
        </div>
      </section>
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
        class="search-form-wrapper-mobile__search-form"
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
      <div class="scroll-hide">
        <nav class="bottom-wrapper__category navs">
          <div
            v-for="category in categories"
            :key="`category-nav-${category.slug}`"
            class="navs__category-nav navs__xl-seperator-fix category-nav"
          >
            <a
              v-if="category.slug === 'home'"
              href="/"
              rel="noreferrer noopener"
              class="category-nav__link"
              @click="closeHamburgerButton"
              v-text="category.name"
            />
            <a
              v-else
              :href="`/category/${category.slug}`"
              rel="noreferrer noopener"
              class="category-nav__link"
              @click="closeHamburgerButton"
              v-text="category.name"
            />
          </div>
          <div
            class="navs__category-nav category-nav category-nav-other category-nav-other-ombuds"
          >
            <a
              href="/ombuds"
              rel="noreferrer noopener"
              class="category-nav__link"
              v-text="'公評人專區'"
            />
          </div>
          <div class="navs__category-nav category-nav category-nav-other">
            <a
              href="/story/aboutus"
              rel="noreferrer noopener"
              class="category-nav__link"
              v-text="'關於我們'"
            />
          </div>
          <div
            class="navs__category-nav category-nav category-nav-other category-nav-other-ads"
          >
            <a
              href="/adsales"
              rel="noreferrer noopener"
              class="category-nav__link"
              v-text="'整合行銷'"
            />
          </div>
        </nav>
        <nav class="bottom-wrapper__show navs">
          <div
            v-for="show in allShows"
            :key="`show-nav-${show.slug}`"
            class="navs__category-nav show-nav"
          >
            <a
              :href="handleShowSlug(show.slug)"
              rel="noreferrer noopener"
              class="category-nav__link"
              @click="closeHamburgerButton"
              v-text="show.name"
            />
          </div>
        </nav>
        <nav class="bottom-wrapper__extension navs navs-extension">
          <div
            v-for="extension in extensions"
            :key="`extension-nav-${extension.name}`"
            class="navs__category-nav extension-nav"
          >
            <a
              :href="extension.path"
              rel="noreferrer noopener"
              class="category-nav__link"
              @click="closeHamburgerButton"
              v-text="extension.name"
            />
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import { sendGaEvent } from '~/utils/google-analytics'
import HeaderSearchForm from '~/components/HeaderSearchForm'

export default {
  name: 'Header',
  serverCacheKey() {
    return 'StaticHeader'
  },
  components: {
    HeaderSearchForm,
  },
  data() {
    return {
      showCategories: false,
      showSearchFormWrapper: this.$route.name === 'search-keyword',
      searchKeyword: this.$route.params.keyword,
      extensions: [
        { name: '公評人專區', path: '/ombuds' },
        { name: '關於我們', path: '/story/aboutus' },
        { name: '整合行銷', path: '/adsales' },
      ],
    }
  },
  computed: {
    ...mapGetters({
      categories: 'category/displayedCategories',
      allShows: 'category/displayedShows',
    }),
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
    showCategories() {
      this.$emit('click-hamburger-button', this.showCategories)
    },
  },
  methods: {
    sendGaClickEvent(eventLabel) {
      return sendGaEvent(this.$ga)('header')('click')(eventLabel)
    },
    handleShowSlug(slug) {
      return slug === 'art' || slug === 'doc'
        ? `/show/${slug}/main`
        : `/show/${slug}`
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
      @include media-breakpoint-up(md) {
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
  position: relative;
  z-index: 2;
  &__right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__search-form {
    display: none;
  }
  @include media-breakpoint-up(md) {
    padding: 0 20px 0 40px;
    height: 80px;
    background-color: #fff;
    &__search-form {
      display: flex;
    }
  }
  @include media-breakpoint-up(xl) {
    padding: 0;
    margin-right: 16px;
    margin-left: calc(((100vw - 1200px) / 2) + 100px);
  }
  @include media-breakpoint-up(xxl) {
    margin-left: calc((100vw - 1200px) / 2);
  }
}

.logo {
  @include media-breakpoint-up(md) {
    padding: 6px 0;
  }
  img {
    width: 100px;
    @include media-breakpoint-up(md) {
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
  @include media-breakpoint-up(md) {
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
  display: none;
  &--visible {
    display: initial;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
  &__search-form {
    border: solid 20px $color-grey;
    position: relative;
    z-index: 2;
  }
  &__dimmed-background {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
}

.bottom-wrapper {
  background: $color-blue-deep;
  max-height: calc(100vh - 50px);
  overflow-y: auto;
  @include media-breakpoint-up(md) {
    max-height: auto;
    overflow-y: hidden;
    background: linear-gradient(
      to bottom,
      $color-blue-deep 49%,
      $color-grey 49%,
      $color-grey 98%,
      transparent 98%
    );
    overflow: hidden;
    height: 76px;
  }
  &__category {
    background-color: $color-blue;
    @include media-breakpoint-up(md) {
      background-color: transparent;
    }
  }
  &__show {
    background-color: $color-blue-deep;
    @include media-breakpoint-up(md) {
      background-color: transparent;
    }
  }
  &__extension {
    background-color: #c4c4c4;
    @include media-breakpoint-up(md) {
      background-color: transparent;
      display: none;
    }
  }
}

.scroll-hide {
  @include media-breakpoint-up(md) {
    overflow-x: auto;
    height: 96px;
  }
}

.navs {
  display: flex;
  flex-wrap: wrap;
  padding-top: 37px;
  @include media-breakpoint-up(md) {
    flex-wrap: nowrap;
    padding: 0 40px;
  }
  @include media-breakpoint-up(xl) {
    padding: 0;
    margin-right: 16px;
    margin-left: calc(((100vw - 1200px) / 2) + 100px);
  }
  @include media-breakpoint-up(xxl) {
    margin-left: calc((100vw - 1200px) / 2);
  }
  @mixin separator_line() {
    content: '';
    display: inline-block;
    width: 2px;
    height: 16px;
    background-color: #fff;
  }
  &-extension {
    padding-top: 20px;
    @include media-breakpoint-up(md) {
      display: none;
    }
  }
  &__category-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33.33333%;
    margin: 0 0 32px 0;
    @include media-breakpoint-up(md) {
      width: auto;
      margin: 0;
      &::after {
        @include separator_line;

        background-color: $color-grey-deep;
      }
      &:first-child {
        &::before {
          @include separator_line;

          background-color: $color-grey-deep;
        }
      }
    }
  }
  &__xl-seperator-fix {
    @include media-breakpoint-up(xl) {
      &:nth-last-child(3) {
        &::after {
          @include separator_line;

          background-color: $color-grey-deep;
        }
      }
    }
  }

  .category-nav {
    color: #fff;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.5px;
    line-height: 28px;
    @include media-breakpoint-up(sm) {
      font-size: 16px;
    }
    @include media-breakpoint-up(md) {
      &:hover {
        border-bottom: 2px solid #ffcc01;
        transition: border-bottom 0.15s ease-out;
      }
      a {
        padding: 0 16px;
      }
    }
    &-other {
      display: none;
      @include media-breakpoint-up(md) {
        display: flex;
      }
      @include media-breakpoint-up(xl) {
        font-size: 12px;
        line-height: 28px;
        a {
          padding: 0 8px;
        }
      }
      &-ombuds {
        @include media-breakpoint-up(xl) {
          margin-left: auto;
        }
      }
      &-ads {
        @include media-breakpoint-up(xl) {
          &::after {
            display: none;
            opacity: 0;
          }
        }
      }
    }
  }

  .show-nav {
    color: $color-grey;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 19px;
    border-bottom: 2px solid transparent;
    @include media-breakpoint-up(sm) {
      font-size: 16px;
      line-height: 28px;
    }
    @include media-breakpoint-up(md) {
      color: $color-blue-deep;
      font-weight: 600;
      &:hover {
        border-bottom: 2px solid #ffcc01;
        box-shadow: 0 4px 4px -4px rgba(0, 0, 0, 0.5);
        transition: border-bottom 0.15s ease-out, box-shadow 0.15s ease-out;
      }
      a {
        padding: 0 20px;
      }
    }
    &::after {
      background-color: $color-grey;
      @include media-breakpoint-up(md) {
        background-color: $color-blue-deep;
      }
    }
    &:first-child {
      &::before {
        background-color: $color-grey;
        @include media-breakpoint-up(md) {
          background-color: $color-blue-deep;
        }
      }
    }
  }

  .extension-nav {
    color: $color-blue-deep;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 19px;
    margin-bottom: 20px;
    @include media-breakpoint-up(sm) {
      font-size: 16px;
      line-height: 28px;
    }
    @include media-breakpoint-up(md) {
      display: none;
    }
  }

  .category-nav__link {
    padding: 0 7px;
    text-align: center;
    @include media-breakpoint-up(md) {
      width: auto;
      height: 35px;
      line-height: 35px;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
