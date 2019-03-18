<template>
  <b-list-group>
    <message
      v-for="message in messages"
      :key="message.sid"
      :message="message"
    />
  </b-list-group>
</template>

<script>
import Message from '~/components/Message.vue'

export default {
  components: {
    Message
  },
  props: {
    channelName: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {}
  },
  computed: {
    messages() {
      const channelName = this.channelName
      if (this.$store.state.channel[channelName]) {
        return this.$store.state.channel[channelName].messages
      }
      return []
    }
  }
}
</script>

<style scoped></style>
