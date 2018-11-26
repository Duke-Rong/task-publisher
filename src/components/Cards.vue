<template>
  <div>
    Cards under this guy:
    <button v-on:click="addCard()">Add</button>
  </div>
</template>

<script>
export default {
  name: 'Cards',
  data() {
    return {
      currentGroup: '',
      currentMember: '',
      currentCards: ''
    }
  },
  mounted() {
    this.updateCurrents()
  },
  watch: {
    '$route' (to, from) {
      this.updateCurrents()
      console.log(this.currentMember)
    }
  },
  methods: {
    updateCurrents() {
      this.currentGroup = this.$store.getters.getCurrentGroup
      this.currentMember = this.$store.getters.getCurrentMember
      this.currentCards = this.$store.getters.getCurrentCards
    },
    addCard() {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
