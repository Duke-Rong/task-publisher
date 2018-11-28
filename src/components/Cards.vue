<template>
  <div>
    {{ card.name }}
    {{ card.description }}
    {{ card.dueDate }}
    {{ card.dueTime }}
    {{ card.importance }}
  </div>
</template>

<script>
export default {
  name: 'MainPage',
  props: { card: Object },
  methods: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
