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

          <!-- 展示组下所有成员-->
          <li v-for="(members,indx) in groups.members"
              :key="indx" >
            {{ members.name }}
            <button v-on:click="addCards(members, groups)">Add cards</button>
            <br>

            <!-- 展示人名下所有卡牌-->
            <div>
                <dl v-for="(cards,indxx) in members.cards"
                :key="indxx" >
                <dt>&ensp;-- card name: {{ cards.name }}</dt>
                <dt>&ensp;-- card description: {{ cards.description }}</dt>
                </dl>
            </div>

          </li>
    </div>


    <!-- 增加成员时出现的面板 -->
    <v-dialog
    v-model="CurrentlyAddingMemberToOneGroup"
    max-width="1000px">
        member name: <input type="text" v-model="newMember.name"><br>
        member uid: <input type="text" v-model="newMember.uid"><br>
        <button v-on:click="ok">OK</button>
        <button v-on:click="discard">Discard</button>
    </v-dialog>


    <!-- 增加卡片时出现的面板 -->
    <v-dialog
      v-model="CurrentlyAddingCardToOneMember"
      max-width="1000px">
        card name: <input type="text" v-model="newCard.name"><br>
        card description: <input type="text" v-model="newCard.description"><br>
        <button v-on:click="okForAddCard">OK</button>
        <button v-on:click="discardForAddCard">Discard</button>
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
        return newgroup
      })
    }
  },
  // 使用用户的email作为名字
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

    /**
     * 下面是关于增加卡片的
     * 格式和上面给group增加member是一样的
     */


    // 增加卡片
    addCards: function(members, groups) {
      this.CurrentlyAddingCardToOneMember = true
      this.currentMember = members
      this.currentGroup = groups
    },
    okForAddCard: function() {
      this.cardsToStore.push(this.currentGroup.id)
      this.cardsToStore.push(this.currentMember.id)
      this.cardsToStore.push(this.newCard)
      this.$store.dispatch('addcard', this.cardsToStore)
      this.discardForAddCard()
    },
    discardForAddCard: function() {
      this.currentMember = null;
      this.CurrentlyAddingCardToOneMember = false
      this.newCard = { name: '', description: '' }
      this.cardsToStore = []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
