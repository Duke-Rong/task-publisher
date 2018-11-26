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
          <p v-on:click="changeVisibility(index)"> {{ groups.name }}</p>
          <button v-on:click="set(groups,index)">Set</button>
            <div v-show="groupsExtendSwitch[index]">
              <!-- 展示组下所有成员-->
              <li v-for="(members,indx) in groups.members"
                  :key="indx">
                <!-- 当组员名不是当前用户时，显示paragraph -->
                <!-- 当组员名是当前用户时，显示input好修改名字 -->
                <div
                v-if="members.uid !== user.uid">
                {{ members.name }}</div>
                <div v-else>
                  <input v-model="members.name">
                </div>
                <!-- 当名字是你的时候才出现的更改名字按钮 -->
              </li>
            </div>
        </div>
    </div>

    <div v-show="commaShown">,</div>
    <!-- 增加成员时出现的面板 -->
    <v-dialog
    v-model="CurrentlyAddingMemberToOneGroup"
    max-width="1000px">
        <input type="text" v-model="currentGroup.name"><br>
        <p v-bind:title="'Give this group id to your member so they can join your group!'"> Group ID: {{ currentGroup.id }} </p>
          <!-- group members -->
          <li v-for="(members,membersShownInManageTheGroup) in currentGroup.members"
                :key="membersShownInManageTheGroup">
                <!-- 此处需要对不同用户显示不同的东西 -->
                <!-- 当组员名不是当前用户时，用paragraph显示名字 -->
                <div
                v-if="members.uid !== user.uid">
                {{ members.name }}
                <!-- 当用户是组长时，显示删除组员按钮 -->
                <button
                v-if="user.uid === currentGroup.groupLeader"
                v-on:click="deleteMember(members)">delete</button>

                </div>
                <!-- 当组员名是当前用户时，显示input好修改名字 -->
                <div v-else>
                  <input v-model="members.name">
                  <!-- 当用户是组员时，出现退出按钮 -->
                  <button
                  v-on:click="quit(members)">quit</button>
                </div>
                <br>
              </li>
        <div
        v-if="user.uid === currentGroup.groupLeader">
        member name: <input type="text" v-model="newMember.name"><br>
        member uid: <input type="text" v-model="newMember.uid"><br>
        <button v-on:click="ok">OK</button>
        <button v-on:click="addMember">Add member</button>
        </div>
        <button v-on:click="discard">Discard</button>
    </v-dialog>

    <!-- 组长退出时候发生的对话 -->
    <v-dialog
    v-model="CurrentlyDeletingLeader">
      Please choose the new Group Leader:
      <!-- 此处用v-ratio选择 -->
      <!-- 显示当前以外的人的名字 -->
      <li v-for="(members,membersShownInManageTheGroup) in currentGroup.members"
          :key="membersShownInManageTheGroup"
          v-if="members.uid !== currentGroup.groupLeader">
          {{ members.name }}
          <button v-on:click="exchangeLeader(members)">ok</button>
      </li>
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
      currentGroup: {},
      currentGroupID: '',
      // 删除group leader时候，记住被删除的group leader
      currentGroupOwner: null,
      // 当前正在修改的member
      currentMember: null,
      // 这个开关决定了增加members的dialog的出现与否
      CurrentlyAddingMemberToOneGroup: false,
      // 这个开关决定了增加卡片的dialoag的出现与否
      CurrentlyAddingCardToOneMember: false,
      // 这个开关决定了决定新组长的dialoag的出现与否
      CurrentlyDeletingLeader: false,
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
        newgroup.groupLeader = group.groupLeader
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
    set: function(payload,id) {
        this.CurrentlyAddingMemberToOneGroup = true
        this.currentGroupID = id
        this.resetCurrentGroup()
        // 同时，搜索group owner的在群里的id并保存在currentGroupOwner内
        for (var memb in this.currentGroup.members){
          if (this.currentGroup.members[memb].uid === this.currentGroup.groupLeader){
            this.currentGroupOwner = this.currentGroup.members[memb]
          }
        }
    },
    ok: function() {
      this.$store.dispatch('setgroup', this.currentGroup)
    },
    // 修改组群并上传，然后清除痕迹
    addMember: function() {
      // 将必须的信息传递到store里面去。这包括了group name, group id和member name
      this.membersAndGroupToStore.push(this.currentGroup)
      this.membersAndGroupToStore.push(this.newMember)
      this.$store.dispatch('setmember', this.membersAndGroupToStore)
      const id = this.currentGroup.id
      // 重新抓取currentGroup
      this.resetCurrentGroup()
      // 清理new member
      this.clearMember()
    },
    deleteMember: function(payload) {
      // 删除前确认
      var r = confirm("Are you sure you want to delete" + payload.name + "?")
      if (r){
        // 删除
        this.deleteMemberHelper(payload)
      }
    },
    // 清除痕迹（这包括关闭修改卡）
    discard: function() {
      // this.currentGroup = {}
      this.CurrentlyAddingMemberToOneGroup = false
      this.clearMember()
    },
    // 清理members添加的痕迹
    clearMember: function() {
      this.newMember = { name:'', uid:'' }
      this.membersAndGroupToStore = []
    },
    // 更改被点击的group的boolean值，使其延展/收起
    changeVisibility: function(payload) {
      this.groupsExtendSwitch[payload] = !this.groupsExtendSwitch[payload]
      this.commaShown = !this.commaShown
    },
    // 重新抓取currentGroup
    resetCurrentGroup: function(){
        this.currentGroup = this.groupsInDatabase[this.currentGroupID]
    },
    // 退出本群
    quit: function(payload){
      // 当组长退出时，需要制定群主
      if (this.currentGroup.groupLeader === payload.uid){
        // 打开指定新群主的对话
        this.CurrentlyDeletingLeader = true
      } else {
        // 组员退出，直接退就可以了
        // 删除前确认
        var r = confirm("Are you sure you want to quit?")
        if (r){
          // 删除
          this.deleteMemberHelper(payload)
        }
      }
    },
    // 指定新的群主
    exchangeLeader: function(payload) {
      // 新群主被传入。将他变成群主
      this.currentGroup.groupLeader = payload.uid
      // 升级群的群主
      this.$store.dispatch('setgroup', this.currentGroup)
      // 自己退出
      this.deleteMemberHelper(this.currentGroupOwner)
      // 关闭对话
      this.CurrentlyDeletingLeader = false
    },
    deleteMemberHelper: function(payload) {
      console.log(payload)
      var toDelete = [];
      toDelete[0] = this.currentGroup.id
      toDelete[1] = payload.id
      this.$store.dispatch('deletemember', toDelete)
      this.resetCurrentGroup()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
