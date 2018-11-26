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
             {{ addGroupToGroupsCurrentlyShown(groups) }}
          -----------------------------------
          <br>
          <p>Group {{ index + 1 }}: {{ groups.name }}</p>
          <button v-on:click="changeVisibility(index)">收缩</button>
          <button v-on:click="set(groups)">Add members</button>
          {{ index }}
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

    <div v-show="shown">,</div>
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
      shown: false,
      // 当前用户的用户名
      user: '',
      // 当前显示的groups以及他们是否呈打开趋势
      // 注意！有可能并不需要这个currentGroups，若是不需则可以删除
      groupsCurrentlyShown: [],
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
      cardsToStore: []
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
    // template会将所show的groups一个个传递进来
    // 该方程将他保存在一个array里
    // 每塞一个进来，就在extendSwitch里塞一个false
    // 因此两个array的size应该是一样的
    // Groups的开关就按照extendSwitch来
    // 每个group的开关对应eS[index]
    addGroupToGroupsCurrentlyShown: function(payload) {
      this.groupsCurrentlyShown[this.groupsCurrentlyShown.length] = payload
    },
    changeVisibility: function(payload) {
      this.groupsExtendSwitch[payload] = !this.groupsExtendSwitch[payload]
      this.shown = !this.shown
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
