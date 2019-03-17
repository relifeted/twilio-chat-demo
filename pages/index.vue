<template>
  <section>
    <header>
      <b-navbar toggleable="lg" type="dark" variant="info" fixed="top" sticky>
        <b-navbar-brand href="#">Twilio Chat Demo</b-navbar-brand>
      </b-navbar>
    </header>
    <b-form inline>
      <b-form-input
        v-model="form.userName"
        class="mb-2 mr-sm-2 mb-sm-0"
        placeholder="Enter your name"
      />
      <b-button variant="primary" @click="joinGeneralChannel"
        >Join General Channel</b-button
      >
    </b-form>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        userName: this.$cookies.get('userName')
      }
    }
  },
  methods: {
    async joinGeneralChannel() {
      this.$cookies.set('userName', this.form.userName)
      const fingerprint = await this.$getDeviceFingerprint()
      this.$cookies.set('fingerprint', fingerprint)
      this.$router.push({ path: '/channel/general' })
    }
  }
}
</script>

<style></style>
