<template>
  <b-col tag="section">
    <no-ssr>
      <b-card v-if="!userNameExists" no-body>
        <div slot="header">{{ userName }} @ {{ channelName }}</div>
        <b-card-body v-chat-scroll class="channel-body">
          <message-list :channel-name="channelName" />
        </b-card-body>
        <b-form slot="footer" inline>
          <b-form-input
            v-model="form.message"
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Type ypur message..."
            cols="8"
          />
          <b-button variant="primary" @click="sendMessage">Send</b-button>
        </b-form>
      </b-card>
    </no-ssr>
  </b-col>
</template>
<script>
import { Client } from 'twilio-chat'
import Vue from 'vue'
import VueChatScroll from 'vue-chat-scroll'

import MessageList from '~/components/MessageList.vue'

Vue.use(VueChatScroll)

export default {
  loading: true,
  middleware: 'joinChannel',
  components: {
    MessageList
  },
  data() {
    const userName = this.$cookies.get('userName')
    const channelName = this.$route.params.channel
    return {
      userName,
      channelName,
      form: {
        message: ''
      }
    }
  },
  computed: {
    userNameExists() {
      return !this.userName
    },
    token() {
      return this.$store.state.channel.token
    },
    identity() {
      return this.$store.state.channel.identity
    },
    deviceFingerprint() {
      return this.$store.state.channel.deviceFingerprint
    },
    attributes() {
      const channelName = this.$route.params.channel
      return this.$store.state.channel[channelName].attributes
    },
    members() {
      const channelName = this.$route.params.channel
      return this.$store.state.channel[channelName].members
    },
    messages() {
      const channelName = this.$route.params.channel
      return this.$store.state.channel[channelName].messages
    },
    messagesCount() {
      const channelName = this.$route.params.channel
      return this.$store.state.channel[channelName].messagesCount
    }
  },
  async fetch({ app, route, store }) {
    await store.dispatch('getToken', {
      userName: app.$cookies.get('userName')
      // deviceFingerprint: app.$cookies.get('fingerprint')
    })
    const token = store.state.channel.token

    const client = await Client.create(token)
    const channel = await client.getChannelByUniqueName('general')
    try {
      await channel.join()
    } catch (err) {
      console.warn('join channel error:', err.message)
    }
    await store.dispatch('getChannelMessages', {
      channelName: route.params.channel,
      token,
      channelClient: channel
    })
  },
  async created() {
    this.client = await Client.create(this.token)
    const channelName = this.$route.params.channel
    this.channel = await this.client.getChannelByUniqueName(channelName)
    try {
      await this.channel.join()
    } catch (err) {
      console.warn('join channel error:', err.message)
    }
    this.channel.on('messageAdded', message => {
      console.log('messageAdded:', message.body)
      const media = message.media
        ? {
            contentType: message.media.contentType,
            sid: message.media.sid,
            size: message.media.size,
            filename: message.media.filename
          }
        : {}

      this.$store.commit('messageAddedToChannel', {
        channelName,
        author: message.author,
        body: message.body,
        attributes: message.attributes,
        dateUpdated: message.dateUpdated.toISOString(),
        index: message.index,
        lastUpdatedBy: message.lastUpdatedBy,
        media,
        sid: message.sid,
        timestamp: message.timestamp.toISOString(),
        type: message.type
      })
    })
  },
  methods: {
    sendMessage() {
      const message = this.form.message
      this.form.message = undefined
      this.channel.sendMessage(message)
    }
  }
}
</script>
<style>
.fill {
  height: 100%;
}
.channel-body {
  height: 60vh;
  overflow: scroll;
}
</style>
