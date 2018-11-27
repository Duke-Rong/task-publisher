<template>
  <div>
    <br>
    This is header...maybe
    <br>
    <button v-on:click="Leader">Leader</button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  computed: {
    currentGroup() {
      if (this.$store.getters.getCurrentGroup){
        return this.$store.getters.getCurrentGroup
      } else {
        return null
      }
    },
    currentMember() {
      if (this.$store.getters.getCurrentMember){
        return this.$store.getters.getCurrentMember
      } else {
        return null
      }
    },
    currentCards() {
      if (this.$store.getters.getCurrentCards){
        return this.$store.getters.getCurrentCards
      } else {
        return null
      }
    }
  },
  methods: {
    Leader() {
      this.$store.dispatch('setLeaderButton', true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
