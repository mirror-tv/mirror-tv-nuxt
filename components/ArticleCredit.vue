<template>
  <p v-if="hasContacts">{{ contactsLabel }}<span v-text="contactsText" /></p>
</template>

<script>
const CONTACT_MAPPING = {
  writers: '記者',
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
        return '記者｜'
      }
      return `${CONTACT_MAPPING[this.contactType]}｜`
    },
    contactsText() {
      if (this.isOtherbyline) {
        return this.contacts
      }
      return this.contacts.map((item) => item.name).join('、')
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
p {
  font-size: 14px;
  line-height: 20px;
}
</style>
