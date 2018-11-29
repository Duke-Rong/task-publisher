<template>
  <div>
    <!-- everything in a card -->
    <v-card class="navigation">
      <br>
      <!-- User profile -->
      <v-card>
        <div v-on:click="logout()" v-if="!commaShown">Hello</div>
        <!-- comma the cheater -->
        <div v-on:click="logout()"  v-else>Hello,</div>
        <div v-on:click="logout()">{{ user.email }}</div>
      </v-card>

      <br>

      <!-- for loop. 展示所有groups里面的卡 -->
      <v-card v-for="(groups,index) in groupsInDatabase"
      :key="index">
        <!-- 此处进行筛选 -->
        <!-- 由于每一个group里相同的member只有一个，因此每次组只会显示一次 -->
        <v-card v-for="(members,indxxx) in groups.members"
        :key="indxxx"
        v-if="members.uid === user.uid">
          <!-- 显示属于user的卡片 -->
          <v-card>
            <span v-on:click="changeGroupExtensionVisibility(groups,index)">
              {{ groups.name }}
            </span>
              <v-btn icon v-on:click="set(groups,index)">
                  <v-icon>toc</v-icon>
              </v-btn>
            <v-card-text v-show="groupsExtendSwitch[index]">
              <!-- 展示组下所有成员-->
              <li
              v-for="(members,indx) in groups.members"
              :key="indx"
              v-on:click="ShowHisCards(members)">
                <router-link :to="'/mainpage/' + members.id">{{ members.name }}</router-link>
              </li>
            </v-card-text>
            <v-divider></v-divider>
          </v-card>
        </v-card>
      </v-card>

      <br>

      <!-- add group and create group button -->
      <v-card>

        <v-btn color="primary" small dark
        v-on:click="addGroupShown()">
          <v-icon >add</v-icon>
        </v-btn> Add into a group

        <br>

        <v-btn color="primary" small dark
        v-on:click="createGroupShown()">
            <v-icon >add</v-icon>
        </v-btn> Create a group

      </v-card>

    </v-card>




    <!-- Manage group时出现的对话 -->
    <v-dialog
    v-model="CurrentlyManagingTheGroup"
    max-width="1000px">
      <v-card>
        <div v-if="currentGroup.groupLeader === user.uid">
          Group name: <input type="text" v-model="currentGroup.name"><br>
        </div>
        <div v-else>
          Group name: {{ currentGroup.name }}
        </div>
        <!-- 当user = group leader时才会出现group id -->
        <p v-if="currentGroup.groupLeader === user.uid"
        v-bind:title="'Give this group id to your member so they can join your group!'"> Group ID: {{ currentGroup.id }} </p>
          <!-- group members -->
          <li v-for="(members,membersShownInManageTheGroup) in currentGroup.members"
                :key="membersShownInManageTheGroup">
                <!-- 此处需要对不同用户显示不同的东西 -->
                <!-- 当组员名不是当前用户时，显示paragraph -->
                <!-- 当组员名是当前用户时，显示input好修改名字 -->
                <div
                v-if="members.uid !== user.uid">
                {{ members.name }}
                <!-- 当用户是组长时，显示删除组员按钮 -->
                <v-btn icon
                v-if="user.uid === currentGroup.groupLeader"
                v-on:click="deleteMember(members)">
                  <v-icon>delete</v-icon>
                </v-btn>

                </div>
                <!-- 当组员名是当前用户时，显示input好修改名字 -->
                <div v-else>
                  <input v-model="members.name">
                  <!-- 当用户是组员时，出现退出按钮 -->
                  <v-btn icon
                  v-on:click="quit(members)">
                    <v-icon>cancel</v-icon>
                  </v-btn>
                </div>
                <br>
              </li>
        <div
        v-if="user.uid === currentGroup.groupLeader">
        member name: <input type="text" v-model="newMember.name"><br>
        member uid: <input type="text" v-model="newMember.uid"><br>
        <button v-on:click="addMember">Add member</button>
        </div>
        <v-btn color="primary" small dark
        v-on:click="confirmChange">
          CONFIRM CHANGE
        </v-btn>
        <v-btn color="red" small dark
        v-on:click="discard">
          CLOSE
        </v-btn>

      </v-card>
    </v-dialog>

    <!-- 组长退出时候发生的对话 -->
    <v-dialog
    v-model="CurrentlyDeletingLeader">
      <v-card>
        <v-card-title>
          Please choose the new Group Leader:
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-radio-group v-model="newLeader">
            <div v-for="(members,membersShownInManageTheGroup) in currentGroup.members"
            :key="membersShownInManageTheGroup"
            v-if="members.uid !== currentGroup.groupLeader">
              <v-radio :label="members.name" :value="members"></v-radio>
            </div>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click="CurrentlyDeletingLeader = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="exchangeLeader">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 创建组时发生的对话 -->
    <v-dialog
    v-model="CurrentlyCreatingGroup">
      <v-card>
        <p>Create a new group</p>
        Group name :
        <input type="text" v-model="newGroup.name"><br>
        <br>
        <button v-on:click="createGroup">create</button>
        <button @click="CurrentlyCreatingGroup=false">close</button>
      </v-card>
    </v-dialog>

    <!-- 加入组时发生的对话 -->
    <v-dialog
    v-model="CurrentlyAddingIntoAGroup">
      <v-card>
        <p>Please enter the group ID:</p>
        Group id :
        <input type="text" v-model="GroupIDGoingToAdd"><br>
        <button v-on:click="addIntoAGroup">enter</button>
        <button @click="CurrentlyAddingIntoAGroup = false">close</button>
        <p>Ask your group leader for the group id</p>
      </v-card>
    </v-dialog>

    <!-- 组织找不到时发生的对话 -->
    <v-dialog
    v-model="GroupNotFound">
      <v-card>
        <p>We cannot found the group :(</p>
        <p>You can:</p>
        Try again :
        <input type="text" v-model="GroupIDGoingToAdd"><br>
        <button v-on:click="addIntoAGroup">enter</button>
        <br> Or ask your leader for the correct group ID
        <button v-on:click="closeTheGroupNotFound">close</button>
      </v-card>
    </v-dialog>

    <!-- 登出时的对话 -->
    <v-dialog
    v-model="Logout"
    max-width="400px">
      <v-card>
        <v-card-title>
          <v-flex xs2>
          </v-flex>
          <h3>Do you really want to log out?</h3>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-actions>
          <v-flex xs3>
          </v-flex>
          <v-btn color="green darken-1" flat @click="confirmLogout()">Yes</v-btn>
          <v-btn color="red darken-1" flat @click="logout()">No</v-btn>
        </v-card-actions>
      </v-card>
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
      // 被增加的组
      newGroup: {
        name: '',
        id: null,
        members: [],
      },
      // 被增加的组员
      newMember: {
        name: '',
        uid: ''
      },
      // 新增的卡片
      newCard: {
        id:'',
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        importance: '',
        addTime: '',
        ownerUid: '',
        ownerName: '',
        ownerIDInGroup: '',
        finished: false
      },
      // 当前正在修改的组，由set()传递
      currentGroup: {},
      currentGroupID: '',
      // 删除group leader时候，记住被删除的group leader
      // 若是以后有其他需求，在set()中加
      currentGroupOwner: null,
      // 当前正在修改的member
      // 只有在被点击到名字后才会更新进store
      currentMember: null,
      // 这个开关决定了增加members的dialog的出现与否
      CurrentlyManagingTheGroup: false,
      // 这个开关决定了增加卡片的dialoag的出现与否
      CurrentlyAddingCardToOneMember: false,
      // 这个开关决定了决定新组长的dialoag的出现与否
      CurrentlyDeletingLeader: false,
      // 新的组长是谁
      newLeader: '',
      // 这个开关决定了决定ACreate group的dialoag的出现与否
      CurrentlyCreatingGroup: false,
      // 这个开关决定了决定Add into group的dialoag的出现与否
      CurrentlyAddingIntoAGroup: false,
      // 这个开关决定了决定group not found的dialoag的出现与否
      GroupNotFound: false,
      // 这个开关决定了决定log out的dialoag的出现与否
      Logout: false,
      // 这个值保存了想加入的group
      GroupIDGoingToAdd: '',
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
    },
    theuser () {
        this.user = this.$store.getters.getCurrentUser
    },
    navigationShown () {
      if (this.$store.getters.getCurrentUser)
        return true
      return false
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
  updated() {
    // situation: 当打开的卡片是member a，而member a被删掉的情况下
    // 会从cards页面里面删掉他
    if (this.currentMember){
      this.setToCurrent(this.currentMember)
    }
  },
  methods: {
    // 将组群绑定到currentGroup里，并打开修改页
    set: function(payload,id) {
        this.CurrentlyManagingTheGroup = true
        this.currentGroupID = id
        this.resetCurrentGroup()
        // 同时，搜索group owner的在群里的id并保存在currentGroupOwner内
        for (var memb in this.currentGroup.members){
          if (this.currentGroup.members[memb].uid === this.currentGroup.groupLeader){
            this.currentGroupOwner = this.currentGroup.members[memb]
          }
        }
    },
    confirmChange: function() {
      this.$store.dispatch('setgroup',this.currentGroup)
      this.discard()
    },
    // 修改组群并上传，然后清除痕迹
    addMember: function() {
      // 将必须的信息传递到store里面去。这包括了group name, group id和member name
      this.membersAndGroupToStore.push(this.currentGroup)
      this.membersAndGroupToStore.push(this.newMember)
      this.$store.dispatch('addmember', this.membersAndGroupToStore)
      const id = this.currentGroup.id
      // 重新抓取currentGroup
      this.resetCurrentGroup()
      // 清理new member
      this.clearMember()
    },
    deleteMember: function(payload) {
      // 删除前确认
      var r = confirm("Are you sure you want to delete " + payload.name + " ?")
      if (r){
        // 删除
        this.deleteMemberHelper(payload)
      }
    },
    // 清除痕迹（这包括关闭修改卡）
    discard: function() {
      this.CurrentlyManagingTheGroup = false
      this.clearMember()
    },
    // 清理members添加的痕迹
    clearMember: function() {
      this.newMember = { name:'', uid:'' }
      this.membersAndGroupToStore = []
    },
    // 更改被点击的group的boolean值，使其延展/收起
    changeGroupExtensionVisibility: function(group, payload) {
      // set current group
      this.currentGroupID = payload
      this.resetCurrentGroup()
      // change visibility
      this.groupsExtendSwitch[payload] = !this.groupsExtendSwitch[payload]
      this.commaShown = !this.commaShown
    },
    // 重新抓取currentGroup
    resetCurrentGroup: function(){
        this.currentGroup = this.groupsInDatabase[this.currentGroupID]
    },
    // 退出本群
    quit: function(payload){
      var r = confirm("Are you sure you want to quit?")
      if (r){
        // 当组长退出时，需要制定群主
        if (this.currentGroup.groupLeader === payload.uid){
          // 打开指定新群主的对话
          var areYouTheOnlyOne = true
          // 若是想退出新建的group，则监测当前的group里是否只有你一人
          for (var memb in this.currentGroup.members){
            // 当还有其他人在里面时
            if (this.currentGroup.members[memb].uid !== this.currentGroup.groupLeader){
              areYouTheOnlyOne = false
            }
          }
          // 如果不是新建的group，则选择新组长
          if (!areYouTheOnlyOne) {
            this.CurrentlyDeletingLeader = true
          } else {
            // 若是新建的group，里面只有你一个人，则直接删除
            this.$store.dispatch('deletegroup',this.currentGroup.id)
            this.discard()
          }
        } else {
          // 组员退出，直接退就可以了
          // 删除前确认
            // 删除
          this.deleteMemberHelper(payload)
        }
      }
    },
    // 指定新的群主
    exchangeLeader: function() {
      // 关闭对话
      this.CurrentlyDeletingLeader = false
      this.CurrentlyManagingTheGroup = false
      // 新群主被传入。将他变成群主
      this.currentGroup.groupLeader = this.newLeader.uid
      // 升级群的群主
      this.$store.dispatch('setgroup', this.currentGroup)
      // 自己退出
      this.deleteMemberHelper(this.currentGroupOwner)
      this.discard()
    },
    deleteMemberHelper: function(payload) {
      var toDelete = [];
      toDelete[0] = this.currentGroup.id
      toDelete[1] = payload.id
      this.$store.dispatch('deletemember', toDelete)
      this.resetCurrentGroup()
    },
    // 打开/关闭增加group的dialog
    createGroupShown: function() {
      this.CurrentlyCreatingGroup = !this.CurrentlyCreatingGroup
    },
    // 创建新的组并保存到firebase里面
    createGroup: function() {
      this.$store.dispatch('savegroup', this.newGroup)
      // 清除刚刚输入的痕迹
      this.ClearAddingGroup()
    },
    // 输入group id,加入那个组
    addIntoAGroup: function() {
      var notFound = true;
      // 搜索所有组并加入
      this.$store.getters.getGroups.map((group) => {
        // 若是找到了符合的组织
        if (group.id === this.GroupIDGoingToAdd){
          this.addIntoAGroupHelper(group)
          notFound = false;
          this.closeTheGroupNotFound()
        }
        if (notFound) {
          this.GroupNotFound = true
          this.CurrentlyAddingIntoAGroup = false
          // -LSIMkoAkqvRYi5oLo9b
        }
      })
      // 清除痕迹
      this.GroupIDGoingToAdd = ''
    },
    addIntoAGroupHelper: function(group) {
      // Check whether the user is already in the group
      var isTheUserInThatGroup = false
      for (var meme in group.members){
        // I found you!
        if(group.members[meme].uid === this.user.uid) {
          isTheUserInThatGroup = true
        }
      }
      // If the user is not already in the group
      // Add him inside
      if (!isTheUserInThatGroup){
        // 为add member做准备
        var toStore = []
        // 塞入要加入的组织
        toStore[0] = group
        // 由于用户没有名字，需要用email当做名字
        this.user.name = this.user.email
        // 塞入用户
        toStore[1] = this.user
        // 飞翔吧！
        this.$store.dispatch('addmember', toStore)
        this.CurrentlyAddingIntoAGroup = false
      } else {
        // Otherwise, user is already in that group
        alert('It looks like you are already in that group.')
      }
    },
    closeTheGroupNotFound: function() {
      this.GroupNotFound = false
    },
    // 掌控加入组的开关
    addGroupShown: function() {
      this.CurrentlyAddingIntoAGroup = !this.CurrentlyAddingIntoAGroup
    },
    // 清理
    ClearAddingGroup: function() {
      this.newGroup.name = ''
      this.newGroup.id = null
      this.newGroup.members = ''
      this.createGroupShown()
    },
    // 当点击某人的名字时，在MainPage里展示他的卡片
    // 通过将三元素传递到store里实现
    ShowHisCards: function(payload) {
      // set current
      this.setToCurrent(payload)
      // leader presssed = false
      this.$store.dispatch('setLeaderButton', false)
    },
    // 将被点击的当前组，当前人和他的卡片统统存入store
    setToCurrent: function(payload) {
      this.currentMember = payload
      var currentToStore = []
      currentToStore[0] = this.currentGroupID
      currentToStore[1] = payload.id
      this.$store.dispatch('setcurrent', currentToStore)
    },
    logout: function() {
      this.Logout = !this.Logout
    },
    confirmLogout: function() {
      this.Logout = false
      this.$store.dispatch('logout')
      firebase.auth().signOut()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .navigation {
        position: fixed;
        width: 36%;
        height: 100%;
        top: 0px;
        background-color: gold;
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
</style>
