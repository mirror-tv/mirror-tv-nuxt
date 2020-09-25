<template>
  <div class="infobox">
    <h3 v-text="infobox.title" />
    <div v-html="infobox.body" />
  </div>
</template>

<script>
export default {
  props: {
    infobox: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.infobox {
  padding: 20px 25px 20px 18px;
  color: #4a4a4a;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  h3 {
    color: #014db8;
    font-size: 20px;
    font-weight: 500;
    + * {
      margin-top: 10px;
    }
  }
  ::v-deep {
    * + * {
      margin-top: 10px;
    }
    li::before {
      content: '';
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 10px;
      vertical-align: middle;
      border-radius: 50%;
      background-color: #e7e7e7;
    }
  }
}
</style>
