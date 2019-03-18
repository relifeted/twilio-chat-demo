export const state = () => ({})

export const mutations = {
  setToken(state, { identity, deviceFingerprint, token }) {
    state.channel.token = token
    state.channel.identity = identity
    state.channel.deviceFingerprint = deviceFingerprint
  },
  setChannelInfo(
    state,
    { channelName, attributes, members, messages, messagesCount }
  ) {
    // console.log('attributes:', attributes)
    // console.log('members:', members)
    // console.log('messages:', messages)
    // console.log('messagesCount:', messagesCount)
    const info = {
      attributes,
      members,
      messages,
      messagesCount
    }
    state.channel[channelName] = info
  },
  messageAddedToChannel(state, message) {
    const { channelName } = message
    state.channel[channelName].messages = [
      ...state.channel[channelName].messages,
      message
    ]
  }
}

export const actions = {
  async getToken({ commit }, { userName, deviceFingerprint }) {
    const { data } = await this.$axios.post('/api/token', {
      identity: userName,
      deviceFingerprint
    })
    // const { identity, deviceFingerprint, token } = data
    // console.log('token:', token)
    // console.log('identity:', identity)
    // console.log('deviceFingerprint:', deviceFingerprint)
    commit('setToken', data)
  },

  async getChannelMessages({ commit }, { channelName, token, channelClient }) {
    const [attributes, members, messages, messagesCount] = await Promise.all([
      channelClient.getAttributes(),
      channelClient.getMembers(),
      channelClient.getMessages(),
      channelClient.getMessagesCount()
    ])
    // const attributes = await channelClient.getAttributes()
    // const members = await channelClient.getMembers()
    // const messages = await channelClient.getMessages()
    // const messagesCount = await channelClient.getMessagesCount()
    commit('setChannelInfo', {
      channelName,
      attributes,
      members: members.map(member => ({
        attributes: member.attributes,
        dateCreated: member.dateCreated.toISOString(),
        dateUpdated: member.dateUpdated.toISOString(),
        identity: member.identity,
        isTyping: member.isTyping,
        lastConsumedMessageIndex: member.lastConsumedMessageIndex,
        lastConsumptionTimestamp: member.lastConsumptionTimestamp,
        sid: member.sid,
        type: member.type
      })),
      messages: messages.items.map(item => {
        const media = item.media
          ? {
              contentType: item.media.contentType,
              sid: item.media.sid,
              size: item.media.size,
              filename: item.media.filename
            }
          : {}

        return {
          author: item.author,
          body: item.body,
          attributes: item.attributes,
          dateUpdated: item.dateUpdated.toISOString(),
          index: item.index,
          lastUpdatedBy: item.lastUpdatedBy,
          media,
          sid: item.sid,
          timestamp: item.timestamp.toISOString(),
          type: item.type
        }
      }),
      hasNextPage: messages.hasNextPage,
      hasPrevPage: messages.hasPrevPage,
      messagesCount
    })
  }
}
