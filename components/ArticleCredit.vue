<template>
  <p v-if="hasContacts">{{ contactsLabel }}{{ contactsName }}</p>
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
      type: [Array, String],
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
    contactsName() {
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
