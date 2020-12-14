<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <p v-if="hasContacts">{{ contactsLabel }}<span v-html="contactsHtml" /></p>
</template>

<script>
const CONTACT_MAPPING = {
  writers: '作者',
  photographers: '攝影',
  cameraOperators: '影音',
  designers: '設計',
  engineers: '工程',
  vocals: '主播',
}

export default {
  props: {
    contactType: {
      type: String,
      default: undefined,
    },
    contacts: {
      type: [Array, String, undefined],
      required: true,
    },
  },
  computed: {
    contactsLabel() {
      if (this.isOtherbyline) {
        return undefined
      }
      return `${CONTACT_MAPPING[this.contactType]}｜`
    },
    contactsHtml() {
      if (this.isOtherbyline) {
        return this.contacts
      }
      return this.contacts
        .map(
          (item) =>
            `<a href="/author/${item.slug}" target="_blank" rel="noreferrer noopener">${item.name}</a>`
        )
        .join('、')
    },
    hasContacts() {
      return this.contacts?.length > 0
    },
    isOtherbyline() {
      return !CONTACT_MAPPING[this.contactType]
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ a {
  padding: 15px 0;
}
</style>
