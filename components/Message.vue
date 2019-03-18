<template>
  <b-list-group-item class="container-fluid">
    <b-row>{{ message.author }}:</b-row>
    <b-row>
      <b-col class="text-right">{{ message.body }}</b-col>
    </b-row>
    <b-row>
      <MessageDate class="text-right" :date="message.dateUpdated" />
    </b-row>
  </b-list-group-item>
</template>

<script>
import MessageDate from '~/components/MessageDate.vue'

export default {
  components: {
    MessageDate
  },
  props: {
    message: {
      type: Object,
      default: () => ({})
    }
  }
  // data() {
  //   return {
  //     message: {}
  //   }
  // }
  // computed: {
  //   message() {
  //     return this.message
  //   }
  // }
}
</script>

<style></style>
