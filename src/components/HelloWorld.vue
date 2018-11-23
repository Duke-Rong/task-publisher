<template>
  <div>
    Hello, {{ user.email }}
    <br>
    <router-link to="/add">Add group</router-link>
    <br>
    <router-link to="/delete">Delete group</router-link>
    <br>
    <!-- for loop. 展示所有groups里面的卡-->
    <div v-for="(groups,index) in groupsInDatabase"
        :key="index">
        -----------------------------------
        <br>
        Group {{ index + 1 }}: {{ groups.name }}
        <br>
        id: {{ groups.id }}
        <button v-on:click="set(groups)">Add members</button>
        <li v-for="(members,indx) in groups.members"
            :key="indx" >
          {{ members.name }}
        </li>
    </div>
    <!-- 增加成员时出现的面板 -->
    <v-dialog
    v-model="CurrentlyAddingMemberToOneGroup"
    max-width="1000px">
        member name: <input type="text" v-model="name"><br>
        <button v-on:click="ok">OK</button>
        <button v-on:click="discard">Discard</button>
    </v-dialog>
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'HelloWorld',
  // 包含了修改和显示groups的必要元素
  data() {
    return {
      // 当前用户的用户名
      user: '',
      // 被增加的组员名
      name: '',
      // 当前正在修改的组，由set()传递
      currentGroup: null,
      // 这个开关决定了dialog的出现与否
      CurrentlyAddingMemberToOneGroup: false,
      // 传递到store里的内容
      toStore: []
    }
  },
  computed: {
    // 将所有store,也就是firebase里面所有的组群展现给你们看
    groupsInDatabase () {
      return this.$store.getters.getGroups.map((group) => {
        const newgroup = {}
        newgroup.name = group.name
        newgroup.id = group.id
        newgroup.members  = group.members
        return newgroup
      })
    }
  },
  // 使用用户的email作为名字
  activated() {
    this.user = firebase.auth().currentUser
  },
  methods: {
    // 将组群绑定到currentGroup里，并打开修改页
    set: function(payload) {
        this.CurrentlyAddingMemberToOneGroup = true
        this.currentGroup = payload
    },
    // 修改组群并上传，然后清除痕迹
    ok: function() {
      // 将必须的信息传递到store里面去。这包括了group id和member name
      this.toStore.push(this.currentGroup.id)
      this.toStore.push(this.name)
      this.$store.dispatch('setmember', this.toStore)
      this.discard()
    },
    // 清除痕迹（这包括关闭修改卡）
    discard: function() {
      this.currentGroup = null;
      this.CurrentlyAddingMemberToOneGroup = false
      this.name = ''
      this.toStore = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
