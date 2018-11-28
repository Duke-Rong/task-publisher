<template>
  <div>
    {{ card.name }}
    {{ card.description }}
    {{ card.dueDate }}
    {{ card.dueTime }}
    {{ card.importance }}
    <button v-on:click="finish()" v-show="!card.finished">Finish</button>
    <button v-on:click="finish()" v-show="card.finished">Put Back</button>
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  props: { card: Object },
  methods: {
    // Press this button means the task is finished
    // Move it to the finished place
    finish() {
      this.card.finished = !this.card.finished
      this.$store.dispatch('updateCard',this.card)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
