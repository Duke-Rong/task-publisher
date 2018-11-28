<template>
  <div>
    <br>
    This is header...maybe
    <br>
    <button v-on:click="Leader" v-show="currentCardsAvailable">Leader</button>
    <button v-on:click="sortBy(1)" v-show="currentCardsAvailable">sortByImportance</button>
    <button v-on:click="sortBy(0)" v-show="currentCardsAvailable">sortByAddTime</button>
    <button v-on:click="sortBy(2)" v-show="currentCardsAvailable">sortByDueDate</button>
    <button v-on:click="antisort()" v-show="currentCardsAvailable">anti-sort</button>
    <button v-on:click="calendar()" v-show="currentCardsAvailable">calendar</button>
    <button v-on:click="finish()" v-show="currentCardsAvailable">Finish Tasks</button>
    <button v-on:click="finish()" v-show="currentCardsAvailable">Ongoing Tasks</button>
    <button v-on:click="helpVision()">Help</button>

    <v-dialog
    v-model="help">
      广告位招租！
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      help: false
    }
  },
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
    },
    // If current cards are null, some buttons shall not show
    currentCardsAvailable() {
      return this.$store.getters.getCurrentCardsAvailable
    }
  },
  methods: {
    Leader() {
      this.$store.dispatch('setLeaderButton', true)
      this.$store.dispatch('setCurrentCardsToLeaderForm')
    },
    sortBy(payload) {
      this.$store.dispatch('setSortType', payload)
    },
    antisort() {
      this.$store.dispatch('antisort')
    },
    finish() {
      this.$store.dispatch('changeFinishVision')
    },
    calendar() {
      this.$router.push('/calendar')
    },
    helpVision() {
      this.help = !this.help
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
