<template>
  <b-col class="text-right">{{ fromNow }}</b-col>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    date: {
      type: String,
      default: () => ({})
    }
  },
  computed: {
    fromNow() {
      if (navigator && navigator.language) {
        // console.log('navigator.language:', navigator.language)
        // console.log('moment.locale():', moment.locale())
        return moment(this.date)
          .locale(navigator.language)
          .fromNow()
      }
      return moment(this.date).fromNow()
    }
  }
}
</script>
