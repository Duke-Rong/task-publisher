// 在store里没有任何currentG/M/C的时候，本页面不显示任何东西除了右上角的两个小玩意。
// 同时还可以显示背景页面，哈哈
// 当有东西传递到store里的current家族的时候，右上角的其他小标签才会逐个出现。



// 本地data: currentGroup, currentMember和currentCards。这些都是在beforeUpdate的时候
// 从store的currentGroup, currentMember和currentCards中直接读取的。

// 每次有修改都要传递到store里面

// leader: 读取currentGroup中所有成员的所有卡片并保存在currentCards[]里。
// 是否传递到store里的currentCards？取决于点击calender页面跳转后本页面是否重新读取store内内容
// （本页面一直显示currentCards内内容）
// sort: 直接对本地currentCards动手动脚并传入store即可
// calender: 直接读取store里面的currentCard
// 需要注意的是，无论是本地卡片显示还是calender，都需要筛选finished = false的卡片。
// 这不占任何时间，只是在v-for里面增加一个条件罢了
// finished: 筛选并显示current cards里面，finished = whatIsNowShowing的卡片。
// 这个whatIsNowShowing是在store里面的，每次点击finished会转化这个boolean的true/false值
// 然后根据这个值决定calendar/cards里面显示的什么玩意。

// 修改：无论是什么时候，修改卡片的确定按钮都是将current card和current member id当做payload
// 传递。也可以在cards里放入member id，则只需要传递卡片。需要注意的是，dispatch后还需要重新
// get一遍新的卡片才行（吗？）



beforeCreate(){
  console.log('beforeCreate')
},

created(){
  console.log('created')
},

beforeMount(){
  console.log('beforeMount')
},

mounted(){
  console.log('mounted')
},


beforeUpdate() {
  console.log('beforeUpdate')
},


updated(){
  console.log('updated')
},

beforeDestroy(){
  console.log('beforeDestroy')
},

destroyed(){
  console.log('destroyed')
},

setTimeout(() => {
  this.AmITheUser = firebase.auth().currentUser.uid
}, 500)



<template>
  <div>
    Hello, {{ user.email }}
    <br>
    <router-link to="/add">Add group</router-link>
    <br>
    <router-link to="/delete">Delete group</router-link>
    <br>
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
    </div>


    <!-- 增加成员时出现的面板 -->
    <v-dialog
    v-model="CurrentlyManagingTheGroup"
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
      CurrentlyManagingTheGroup: false,
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
        this.CurrentlyManagingTheGroup = true
        this.currentGroup = payload
    },
    // 修改组群并上传，然后清除痕迹
    ok: function() {
      // 将必须的信息传递到store里面去。这包括了group id和member name
      this.membersAndGroupToStore.push(this.currentGroup.id)
      this.membersAndGroupToStore.push(this.newMember)
      this.$store.dispatch('addmember', this.membersAndGroupToStore)
      this.discard()
    },
    // 清除痕迹（这包括关闭修改卡）
    discard: function() {
      this.currentGroup = null
      this.CurrentlyManagingTheGroup = false
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




<!-- 此处放main header -->
    <!-- 容器,里面可以包含container -->
    <v-content>
      <!-- 自动与页面调节大小 -->
      <v-container
        fluid>
        <v-layout row>
              <v-flex xs3>
                <navigation/>
              </v-flex>
              <v-flex xs6>
                <Header/>
               </v-flex>
              <v-flex xs12>
                <router-view/>
              </v-flex>
        </v-layout>
      </v-container>
    </v-content>



<!-- 容器,里面可以包含container -->
      <v-content>
        <!-- 自动与页面调节大小 -->
        <v-container
          fluid
          pa-0
          fill-height>
          <v-layout row >
            <v-flex>
              <navigation/>
            </v-flex>
            <v-flex>
              <Header/>
            </v-flex>
            <v-flex>
              <router-view/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>


    {{ card.name }}
    {{ card.description }}
    {{ card.dueDate }}
    {{ card.dueTime }}
    {{ card.importance }}
    <button v-on:click="finish()" v-show="!card.finished">Finish</button>
    <button v-on:click="finish()" v-show="card.finished">Put Back</button>
