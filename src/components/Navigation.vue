<template>
  <div>

  <v-layout row>
    <v-flex>
      <!-- everything in a card -->
      <v-card>
        <!-- User profile -->
        <v-toolbar color="black" dark>
          <h3 v-on:click="profile()">Welcome, <br> {{ user.email }}</h3>
        </v-toolbar>
          <v-list subheader class="OutsideScrollStyle">
            <v-subheader>Groups</v-subheader>
            <!-- for loop. 展示所有groups里面的卡 -->
            <div v-for="(groups,index) in groupsInDatabase" :key="index">
              <v-divider></v-divider>
                <!-- 此处进行筛选 -->
                <!-- 由于每一个group里相同的member只有一个，因此每次组只会显示一次 -->
                <div v-for="(members,indxxx) in groups.members"
                :key="indxxx" >

                  <v-list subheader v-if="members.uid === user.uid">
                    <!-- 展示组名 -->
                    <!-- 平时show h3 -->
                    <div v-if="!groupsExtendSwitch[index]">
                      <v-list-tile>
                        <v-list-tile-content v-on:click="changeGroupExtensionVisibility(groups,index)">
                          <v-list-tile-title>
                            <h3> &nbsp; {{ groups.name }}</h3>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn icon v-on:click="set(groups,index)">
                            <v-icon>toc</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </div>
                    <!-- 点击后会展开 -->
                    <div v-else class="ScrollStyle">
                      <!-- 展开后show v-subheader -->
                      <v-subheader v-on:click="changeGroupExtensionVisibility(groups,index)">{{ groups.name }}</v-subheader>
                      <!-- 展示组下所有成员-->
                      <div
                      v-for="(members,indx) in groups.members"
                      :key="indx"
                      v-on:click="ShowHisCards(index, members)">
                        <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <v-icon>label</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            <router-link :to="'/mainpage/' + members.id" style="text-decoration:none">
                              {{ members.name }}
                              &nbsp;
                              <!-- Show leader button if he is the leader -->
                              <v-icon v-if="members.uid === groups.groupLeader">person</v-icon>
                            </router-link>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        </v-list-tile>
                      </div>
                    </div>
                  </v-list>
                </div>
            </div>
            <v-subheader>Actions</v-subheader>

            <v-list-tile avatar v-on:click="addGroupShown()">
              <v-list-tile-avatar color="primary">
                <v-icon dark>group_add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  Join into a group
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile avatar v-on:click="createGroupShown()">
              <v-list-tile-avatar color="primary">
                <v-icon dark>add</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  Create a group
                </v-list-tile-title>
                <!-- cheating attention! -->
                <span v-if="updateThePage"></span>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>
      </v-card>
    </v-flex>
  </v-layout>



  <!-- Manage group时出现的对话 -->
  <v-dialog
  v-model="CurrentlyManagingTheGroup"
  max-width="500px">
    <v-card>
      <v-card-title>
        <div v-if="currentGroup.groupLeader === user.uid" class="headline">
          <input type="text" v-model="currentGroup.name">
        </div>
        <span v-else class="headline"> {{ currentGroup.name }} </span>
        <!-- 当user = group leader时才会出现group id -->
        <v-tooltip bottom>
          <v-label slot="activator" v-if="currentGroup.groupLeader === user.uid"> Group ID: {{ currentGroup.id }} </v-label>
          <span>Give this group id to your member so they can join your group!</span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>

              <v-list subheader>
                <v-subheader>Group members</v-subheader>
                <!-- group members -->
                <div v-for="(members,membersShownInManageTheGroup) in currentGroup.members"
                  :key="membersShownInManageTheGroup">
                    <v-divider></v-divider>
                    <!-- 此处需要对不同用户显示不同的东西 -->
                    <!-- 当组员名不是当前用户时，显示paragraph -->
                    <v-list-tile avatar v-if="members.uid !== user.uid">
                    <v-list-tile-avatar>
                      <v-icon>label</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{ members.name }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                    <!-- 当用户是组长时，显示删除组员按钮 -->
                    <v-list-tile-action>
                      <v-btn icon
                      v-if="user.uid === currentGroup.groupLeader"
                      v-on:click="deleteMember(members)">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                  <!-- 当组员名是当前用户时，显示input好修改名字 -->
                  <v-list-tile avatar v-else>
                    <v-list-tile-avatar>
                      <v-icon>label</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <input v-model="members.name">
                      </v-list-tile-title>
                    </v-list-tile-content>
                    <!-- 当用户是组员时，出现退出按钮 -->
                    <v-list-tile-action>
                      <v-btn icon v-on:click="quit(members)">
                        <v-icon>cancel</v-icon>
                      </v-btn>
                    </v-list-tile-action>
                  </v-list-tile>
                </div>
              <v-divider></v-divider>
              <v-list-tile avatar v-on:click="addMemberHelper" v-if="user.uid === currentGroup.groupLeader">
                <v-list-tile-avatar small color="primary">
                  <v-icon dark>person_add</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>
                    Add a member
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat v-on:click="closeManageMemberDialog">Close</v-btn>
        <v-btn color="blue darken-1" flat v-on:click="confirmChange">Save</v-btn>
      </v-card-actions>
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
          :key="membersShownInManageTheGroup">
            <v-radio :label="members.name" :value="members"
            v-if="members.uid !== currentGroup.groupLeader"></v-radio>
          </div>
        </v-radio-group>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" flat @click="CurrentlyDeletingLeader=false">Close</v-btn>
        <v-btn color="blue darken-1" flat @click="exchangeLeader">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 增加member时发生の会话 -->
  <v-dialog
  v-model="addingMemberDialog"
  max-width="400px">
    <v-card>
      <v-card-text>
        <v-text-field label="Name in the group" :rules="textFieldNull" v-model="newMember.name" hint="This name will show in the group" required clearable></v-text-field>
        <v-text-field label="Member Uid" :rules="textFieldNull && uidVaild" v-model="newMember.uid" hint="Ask the member for the uid. Your member could check his uid in the profile page after registeration" required clearable></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn :disabled="!vaildAddingMember" color="green darken-1" flat @click="addMember">Confirm</v-btn>
        <v-btn color="red darken-1" flat @click="addingMemberDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  <!-- 创建组时发生的对话 -->
  <v-dialog
  v-model="CurrentlyCreatingGroup"
  max-width="500">
    <v-card>
      <v-card-title class="headline">
        Create a new group
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Group name" :rules="textFieldNull" v-model="newGroup.name" clearable></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click="CurrentlyCreatingGroup=false">Close</v-btn>
        <v-btn :disabled="!vaildCreateNewGroup" color="blue darken-1" flat v-on:click="createGroup">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 加入组时发生的对话 -->
  <v-dialog
  v-model="CurrentlyAddingIntoAGroup"
  max-width="500">
    <v-card>
      <v-card-title>
        <div class="headline">Join into a group</div>
        <v-label>Enter the id of the group you want to join into</v-label>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="Group id" :rules="textFieldNull" v-model="GroupIDGoingToAdd" hint="Ask your group leader for the group id" clearable></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" flat @click="CurrentlyAddingIntoAGroup = false">Close</v-btn>
        <v-btn :disabled="!vaildAddingIntoAGroup" color="blue darken-1" flat v-on:click="addIntoAGroup">Join</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 组织找不到时发生的对话 -->
  <v-dialog
    v-model="GroupNotFound"
    max-width="500">
      <v-card>
        <v-card-title>
          <span class="headline">OOPS!</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                It looks like we cannot found the group :( <br>
                You can try again:
                <br>
                <v-text-field label="Group id" :rules="textFieldNull" v-model="GroupIDGoingToAdd" hint="Ask your group leader for the group id" clearable></v-text-field>
                <br>
                Or ask your leader for the correct group ID
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat v-on:click="closeTheGroupNotFound">Close</v-btn>
          <v-btn :disabled="!vaildAddingIntoAGroup" color="blue darken-1" flat v-on:click="addIntoAGroup">Join</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 浏览自己的profile时的对话 -->
    <v-dialog
    v-model="ProfileDialog"
    max-width="500px">
      <v-card>
        <v-card-title>
          <v-layout column>
            <v-flex class="headline">
              Profile
            </v-flex>
            <v-tooltip bottom>
              <v-label slot="activator">user id: {{ user.uid }}</v-label>
              <span>Here is your unique user id. Give your user id to your group leader to be involved</span>
            </v-tooltip>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-window v-model="step">
                  <v-window-item :value="1">
                    <!-- User profile -->
                    <v-list>
                      <!-- user email -->
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <v-icon>email</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            Email: {{ user.email }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <!-- 修改email -->
                        <v-list-tile-action>
                          <v-btn icon @click="changeEmailHelper()">
                            <v-icon>keyboard_arrow_right</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <!-- user Password -->
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <v-icon>fingerprint</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            Password
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <!-- Change password -->
                        <v-list-tile-action>
                          <v-btn icon @click="step=3">
                            <v-icon>keyboard_arrow_right</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <!-- user Display name -->
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <v-icon>face</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>
                            Nick name: {{ user.displayName }}
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <!-- Change password -->
                        <v-list-tile-action>
                          <v-btn icon @click="changeNicknameHelper()">
                            <v-icon>keyboard_arrow_right</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                      <v-divider></v-divider>
                    </v-list>
                  </v-window-item>
                  <!-- Change email -->
                  <v-window-item :value="2">
                    <v-card-text>
                      <h3>New email:</h3>
                      <v-text-field v-model="oldUser.email" clearable></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn flat @click="step=1">Back</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="authorize=true">change</v-btn>
                    </v-card-actions>
                  </v-window-item>
                  <!-- Change password -->
                  <v-window-item :value="3">
                    <v-card-text>
                      <v-text-field
                        label="Old Password"
                        type="password"
                        v-model="oldUser.password"
                      ></v-text-field>
                      <v-text-field
                        label="New Password"
                        type="password"
                        v-model="oldUser.newPassword"
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn flat @click="step=1">Back</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="resetPassword(oldUser.password,oldUser.newPassword)">change</v-btn>
                    </v-card-actions>
                  </v-window-item>
                  <!-- Change nickname -->
                  <v-window-item :value="4">
                    <v-card-text>
                      <h3>New Nickname:</h3>
                      <v-text-field v-model="oldUser.nickname" clearable></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn flat @click="step=1">Back</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" @click="changeNickName(oldUser.nickname)">change</v-btn>
                    </v-card-actions>
                  </v-window-item>
                </v-window>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="step === 1" color="blue darken-1" flat @click="ProfileDialog=false">Close</v-btn>
          <v-btn v-if="step === 1" color="red darken-1" flat v-on:click="logout()">Log out</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 当要修改email或者密码时弹出的再次索取密码的对话框 -->
    <v-dialog
    v-model="authorize"
    max-width="400px">
    <v-card>
      <v-card-title>
        Authorization
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field type="password" label="Please input your password again" v-model="oldUser.password" hint="Change email need your authorization"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="authorize=false">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="changeEmail(oldUser.email, oldUser.password)">Confirm</v-btn>
      </v-card-actions>
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
      // 修改前的user profile
      oldUser: {
        email: null,
        password: null,
        nickname: null,
        // 为授权所获取的password
        password: null,
        // 新的password
        newPassword: null
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
      // 这个开关决定了增加member的dialog的出现与否
      addingMemberDialog: false,
      // 这个开关决定了增加卡片的dialoag的出现与否
      CurrentlyAddingCardToOneMember: false,
      // 这个开关决定了决定新组长的dialoag的出现与否
      CurrentlyDeletingLeader: false,
      // 新的组长是谁
      newLeader: '',
      // 这个开关决定了ACreate group的dialoag的出现与否
      CurrentlyCreatingGroup: false,
      // 这个开关决定了Add into group的dialoag的出现与否
      CurrentlyAddingIntoAGroup: false,
      // 这个开关决定了group not found的dialoag的出现与否
      GroupNotFound: false,
      // 这个开关决定了profile的dialoag的出现与否
      ProfileDialog: false,
      // 这个开关决定了log out的dialoag的出现与否
      Logout: false,
      // 这个开关决定了change profile时出现哪个window
      // 1: default
      // 2: change email
      // 3: change password
      // 4: change display name
      step: 1,
      // 这个开关决定了authorize的dialog的出现与否
      // 当用户要更改邮箱或密码时，需要用户再次输入自己的密码来获取权限
      authorize: false,
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
      updateThePage: false,
      // 当组长改动名字但又点击取消后，将这个名字还回去
      oldGroupNameBeforeChange: '',
      // 这个玩意检查在填写信息的时候是否没填
      textFieldNull: [val => (val || '').length > 0 || 'This field is required'],
      // 这个玩意检查uid是否小于25位
      uidVaild: [val => (val || '').length > 25 || 'Please input vaild uid']
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
    },
    // See if the leader is vaild to add the member
    vaildAddingMember () {
      return (this.newMember.name && this.newMember.uid)
    },
    // See if the user is vaild to create the group
    vaildCreateNewGroup () {
      return (this.newGroup.name)
    },
    // See if the user are able to add into a group
    vaildAddingIntoAGroup () {
      return (this.GroupIDGoingToAdd)
    },
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
    // situation: 当member产生变化，
    // 如当打开的卡片是member a，而member a被删掉的情况下
    // 或者member底下增加/删除了卡片
    // 会更新current
    if (this.currentMember === null){
      this.setToCurrent(null)
    } else {
      this.setToCurrent(this.currentMember)
    }
  },
  methods: {
    // 使用情况：点击group的set按钮时
    // 将组群绑定到currentGroup里，并打开修改页
    set: function(payload,id) {
        this.CurrentlyManagingTheGroup = true
        // 此处的id保存的是个index？
        this.currentGroupID = id
        this.resetCurrentGroup()
        this.oldGroupNameBeforeChange = this.currentGroup.name
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
      // 关闭对话
      this.addingMemberDialog = false
    },
    // Open the adding member dialog
    addMemberHelper: function() {
      this.addingMemberDialog = true
    },
    // Close the adding member dialog
    closeAddingMemberDialog: function() {
      this.addingMemberDialog = false
    },
    deleteMember: function(payload) {
      // 删除前确认
      var r = confirm("Are you sure you want to delete " + payload.name + " ?")
      if (r){
        // 删除
        this.deleteMemberHelper(payload)
      }
    },
    // close the manage group dialog
    closeManageMemberDialog: function() {
      this.discard()
      this.currentGroup.name = this.oldGroupNameBeforeChange
      this.oldGroupNameBeforeChange = ''
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
      this.updateThePage = !this.updateThePage
    },
    // 重新抓取currentGroup
    // 由于groupsInDatabase是以Index来排列，不是以id排列
    // 因此this.currentGroupID是Index形式的数字（e.g. 0），而不是id形式
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
    ShowHisCards: function(id, payload) {
      // set current group
      this.currentGroupID = id
      this.resetCurrentGroup()
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
      if (payload){
        currentToStore[1] = payload.id
      }
      this.$store.dispatch('setcurrent', currentToStore)
    },
    // open the profile dialog
    profile: function() {
      this.ProfileDialog = true
    },
    // Open the logout dialog
    logout: function() {
      this.Logout = !this.Logout
    },
    // When the user confirms log out, log him out
    confirmLogout: function() {
      this.Logout = false
      this.$store.dispatch('logout')
      firebase.auth().signOut()
    },
    // update the email for the user
    changeEmail: function(newEmail, thepassword) {
      // create the credential to update
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.user.email,
        thepassword
      )
      const tempuser = firebase.auth().currentUser
      // re autherize
      tempuser.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
        tempuser.updateEmail(newEmail).then(function() {
          // after successfully update the email, reload the page
          location.reload()
        }).catch(function(error) {
          // Otherwise, the error will be caught
          alert(error.message)
        });
      }).catch(function(error) {
        // Otherwise, the error will be caught
        alert(error.message)
      });
    },
    // open the change email dialog
    changeEmailHelper: function() {
      this.step = 2
      this.oldUser.email = this.user.email
    },
    // reset password
    resetPassword: function(oldPassword, newPassword) {
      // create the credential to update
      const credential = firebase.auth.EmailAuthProvider.credential(
        this.user.email,
        oldPassword
      )
      const tempuser = firebase.auth().currentUser
      // re autherize
      tempuser.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
        tempuser.updatePassword(newPassword).then(function() {
          // after successfully update the email, reload the page
          location.reload()
        }).catch(function(error) {
          // Otherwise, the error will be caught
          alert('New password problem: ' + error.message)
        });
      }).catch(function(error) {
        // Otherwise, the error will be caught
        alert('Old password problem: ' + error.message)
      });
    },
    // change the display name of the user
    changeNickName: function(newnickname) {
      firebase.auth().currentUser.updateProfile({
        displayName: newnickname
      }).then(function() {
        location.reload()
      }).catch(function(error) {
        alert(error.message)
      });
    },
    // open the change nick name dialog
    changeNicknameHelper: function(){
      this.step = 4
      this.oldUser.nickname = this.user.displayName
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navigation {
    background-color: gold;
    background-size: 100% 100%;
  }
  .ScrollStyle  {
    max-height: 500px;
    overflow-y: scroll;
  }
  .OutsideScrollStyle  {
    max-height: 659px;
    overflow-y: scroll;
  }
</style>
