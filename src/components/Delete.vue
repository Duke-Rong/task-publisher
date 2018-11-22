<template>
  <div>
      <router-link to="/">Show cards</router-link>
      <p>Delete group</p>
      Group id:
      <input type="text" v-model="id"><br>
      <button v-on:click="deleteGroup">Delete</button>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Delete',
  data () {
    // 删除一个group，只需要知道其id即可
    return {
      id: ''
    }
  },
  methods: {
    // 其实不用搞得这么麻烦，直接删除即可
    deleteGroup: function (){
      // 删除前确认
      var r = confirm("Are you sure you want to delete this group?")
      if (r){
        // 删除
        this.$store.dispatch('deletegroup', this.id)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
