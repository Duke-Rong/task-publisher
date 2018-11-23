<template>
  <div>
      <router-link to="/">Show groups</router-link>
      <p>Add groups</p>
      Group name :
      <input type="text" v-model="group.name"><br>
      <br>
      <button v-on:click="createGroup">create</button>
  </div>
</template>

<script>
// 新建group
import firebase from 'firebase'

export default {
  name: 'Add',
  data () {
    return {
      // 新建立的group。含有名字，id和members三项
      group: {
        name: '',
        id: null,
        members: [],
      }
    }
  },
  methods: {
    // 创建新的组并保存到firebase里面
    createGroup: function(){
      this.$store.dispatch('savegroup', this.group)
      // 清除刚刚输入的痕迹
      this.Clear()
    },
    Clear: function() {
      this.group.name = ''
      this.group.id = null
      this.group.members = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
