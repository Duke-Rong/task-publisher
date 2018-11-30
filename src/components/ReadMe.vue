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
