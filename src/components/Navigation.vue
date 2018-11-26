<template>
  <div>
    Hello,
    <br>
    {{ user.email }}
    <br>
    <router-link to="/add">Add group</router-link>
    <!-- for loop. 展示所有groups里面的卡 -->
    <div v-for="(groups,index) in groupsInDatabase"
        :key="index">
        <!-- 此处进行筛选 -->
        <!-- 由于每一个group里相同的member只有一个，因此每次组只会显示一次 -->
        <div v-for="(members,indxxx) in groups.members"
             :key="indxxx"
             v-if="members.uid === user.uid">
          -----------------------------------
          <br>
          <p>Group {{ index + 1 }}: {{ groups.name }}</p>
          <button v-on:click="changeVisibility(index)">收缩</button>
          <button v-on:click="set(groups)">Set</button>
            <div v-show="groupsExtendSwitch[index]">
              <!-- 展示组下所有成员-->
              <li v-for="(members,indx) in groups.members"
                  :key="indx">
                {{ members.name }}
                <br>
              </li>
            </div>
        </div>
    </div>

    <div v-show="commaShown">,</div>
    <!-- 增加成员时出现的面板 -->
    <v-dialog
    v-model="CurrentlyAddingMemberToOneGroup"
    max-width="1000px">
        member name: <input type="text" v-model="newMember.name"><br>
        member uid: <input type="text" v-model="newMember.uid"><br>
        <button v-on:click="ok">OK</button>
        <button v-on:click="discard">Discard</button>
    </v-dialog>

  </div>
</template>

<script>
// v-show="groupsExtendSwitch[index]"
import firebase from 'firebase'
export default {
  name: 'Navigation',
  // 包含了修改和显示groups的必要元素
  data() {
    return {
      // 当前用户的用户名
      user: '',
      // groups是否呈打开趋势
      groupsExtendSwitch: [],
      // 被增加的组员
      newMember: {
        name: '',
        uid: ''
      },
      // 新增的卡片
      newCard: {
        name: '',
        description: ''
      },
      // 当前正在修改的组，由set()传递
      currentGroup: null,
      // 当前正在修改的member
      currentMember: null,
      // 这个开关决定了增加members的dialog的出现与否
      CurrentlyAddingMemberToOneGroup: false,
      // 这个开关决定了增加卡片的dialoag的出现与否
      CurrentlyAddingCardToOneMember: false,
      // 当增加members时传递到store里的内容
      membersAndGroupToStore: [],
      // 当增加cards时传递到store里的内容
      cardsToStore: [],
      // 这其实是一个小心机
      // 由于v-show groupsExtendSwitch不能直接更新页面
      // 因此用它来更新页面。
      // 这玩意v-show到一个逗号，每次change groupsExtendSwitch
      // 他都会被改变值，使逗号出现/消失
      // 以此来update页面，从而触发组员的shou
      commaShown: false
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
        // 我们将group size的false存在这个array中
        // 这个array决定了groups是否延伸
        this.groupsExtendSwitch[this.groupsExtendSwitch.length] = false
        return newgroup
      })
    }
  },
  // 当页面跳转的时候，加载user
  created(){
    this.user = this.$store.getters.getCurrentUser
  },
  // 使用用户的email作为名字
  // 仅在刚刚打开页面时使用
  beforeUpdate() {
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
      this.membersAndGroupToStore.push(this.currentGroup.id)
      this.membersAndGroupToStore.push(this.newMember)
      this.$store.dispatch('setmember', this.membersAndGroupToStore)
      this.discard()
    },
    // 清除痕迹（这包括关闭修改卡）
    discard: function() {
      this.currentGroup = null
      this.CurrentlyAddingMemberToOneGroup = false
      this.newMember = { name:'', uid:'' }
      this.membersAndGroupToStore = []
    },
    // 更改被点击的group的boolean值，使其延展/收起
    changeVisibility: function(payload) {
      this.groupsExtendSwitch[payload] = !this.groupsExtendSwitch[payload]
      this.commaShown = !this.commaShown
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
