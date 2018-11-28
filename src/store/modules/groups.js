import { READ_GROUP,
  SET_GROUP,
  ADD_GROUP,
  DELETE_GROUP,
  ADD_MEMBER,
  DELETE_MEMBER,
  SET_CURRENT,
  ADD_CARD,
  LEADER_BUTTON,
  SET_USER,
  SET_SORT_TYPE,
  SORT_BY_IMPORTANCE} from '@/store/mutation-types'
import { groupsDB, db } from '@/services/firebase.conf'
import { firebaseMutations, firebaseAction } from 'vuexfire'


// 新增：currentGroup, currentMember, currentCard
// [SAVE_LOCAL_GROUP/MEMBER/CARD], 在被call的时候将传递而来的current g/m/c存入g/m/c内

const state = {
  // 这应该是整个数据库里有多少groups

  // 此处需要修改！仅读取uid与当前用户吻合的groups
  // 需要clear!

  groups: [],
  // 当前本项目的使用者
  currentUser: '',
  currentGroup: '',
  currentMember: '',
  currentCards: [],
  // 是否按下了leader按钮
  LeaderButtonPushed: false,
  // 这个按钮决定了用户希望进行何种sort
  // 0: sort by add time, 即原始情况
  // 1: sort by importance
  // 2: sort by due time
  sortType: 0,
  // groups
  newgroup: {
    name: '',
    id: '',
    groupLeader: '',
    members: []
  },
  // members
  newMember: {
    name: '',
    id: '',
    uid: '',
    cards: []
  },
  // cards
  newCard: {
    id: '',
    name: '',
    description: '',
    dueDate: '',
    dueTime: '',
    importance: '',
    addTime: '',
    finished: false
  }
}

// getters
const getters = {
  getGroups (state) {
    return state.groups
  },
  getNewGoup (state) {
    return state.newgroup
  },
  getNewCard (state) {
    return state.newCard
  },
  getCurrentUser (state) {
    return state.currentUser
  },
  getCurrentGroup (state) {
    return state.currentGroup
  },
  getCurrentMember (state) {
    return state.currentMember
  },
  getCurrentCards (state) {
    return state.currentCards
  },
  getLeaderButtonPushed (state) {
    return state.LeaderButtonPushed
  },
  getSortType (state) {
    return state.sortType
  }
}

const mutations = {
  // 设置当前该项目的用户
  // call: 项目auth()加载后
  // 一旦决定用户，在关闭整个项目之前是不会自动更新的
  [SET_USER] (state, payload) {
    state.currentUser = payload
  },
  // 这玩意貌似会自动更新！
  // 传入：group id, member id
  [SET_CURRENT] (state, payload) {
    state.currentGroup = state.groups[payload[0]]
    state.currentMember = state.currentGroup.members[payload[1]]
    if (state.currentMember) {
      state.currentCards = state.currentMember.cards
    }
  },
  // 设置卡组成currentGroup内的所有members的卡组
  [LEADER_BUTTON] (state, payload) {
    /*
    state.currentCards = []
    for (var membs in state.currentGroup.members){
      for (var cards in state.currentGroup.members[membs].cards){
        state.currentCards[state.currentCards.length] = state.currentGroup.members[membs].cards[cards]
      }
    }
    */
    state.LeaderButtonPushed = payload
  },
  // 输入：groupID 输出：该group
  [READ_GROUP] (state, payload) {
    groupsDB.child(payload).once('value').then(function (snapshot) {
      state.currentGroup = snapshot.val()
    })
  },
  // 输入群组，可以直接修改firebase里的该群组
  [SET_GROUP] (state, payload) {
    var updates = {}
    // 直接提取群组的ID并更新firebase里的那个群组
    // 此处这个updates[]就是所有groups, 而updates[payload.id]就是groups中那个要被改变的
    updates[payload.id] = payload
    groupsDB.update(updates)
  },
  // 新建新群组
  [ADD_GROUP] (state, payload) {
    // 首先输入新的卡片当做payload
    state.newgroup.name = payload.name
    state.newgroup.groupLeader = state.currentUser.uid
    // 将该群组以没有id的形式推入firebase,并获取这个id
    state.newgroup.id = groupsDB.push(state.newgroup).key
    var updates = {}
    updates[state.newgroup.id] = state.newgroup
    groupsDB.update(updates)
    // 这样一来，我们就获取了新的group,包含了完整的id和name
    // 将自己放进去
    state.newMember.name = state.currentUser.email
    state.newMember.uid = state.currentUser.uid
    state.newMember.id = db.ref('/groups/' + state.newgroup.id + '/members').push(state.newMember).key
    var updatess = {}
    updatess[state.newMember.id] = state.newMember
    db.ref('/groups/' + state.newgroup.id + '/members').update(updatess)
  },
  // 输入组号，删除群组
  [DELETE_GROUP] (state, payload) {
    groupsDB.child(payload).remove()
    state.currentMember = null
    state.currentCards = null
  },
  // 由Add传递。payload内含需要增加的组员和群id
  // 传入：payload[0]是group, payload[1]是member
  [ADD_MEMBER] (state, payload) {
    // 获取新组员名字.
    state.newMember.name = payload[1].name
    state.newMember.uid = payload[1].uid
    // 将其push进该组，并用同样的方法获取member id
    state.newMember.id = db.ref('/groups/' + payload[0].id + '/members').push(state.newMember).key
    // 替换掉没有id的members
    var updates = {}
    updates[state.newMember.id] = state.newMember
    db.ref('/groups/' + payload[0].id + '/members').update(updates)
  },
  // 传入：组id和member id
  [DELETE_MEMBER] (state, payload) {
    db.ref('/groups/' + payload[0] + '/members').child(payload[1]).remove()
    // If the member deleting is the same as the one in cards,
    //  remove the current card
    if(state.currentMember.id === payload[1]){
      state.currentMember = null
      state.currentCards = null
    }
  },
  // 增加卡片，格式和增加member是一样的
  [ADD_CARD] (state, payload) {
    // 获取新组员名字.
    state.newCard.name = payload.name
    state.newCard.description = payload.description
    state.newCard.dueDate = payload.dueDate
    state.newCard.dueTime = payload.dueTime
    state.newCard.importance = payload.importance
    state.newCard.addTime = new Date()
    // 将其push进该组，并用同样的方法获取member id
    state.newCard.id = db.ref('/groups/' + state.currentGroup.id + '/members/' + state.currentMember.id + '/cards').push(state.newCard).key
    // 替换掉没有id的members
    var updates = {}
    updates[state.newCard.id] = state.newCard
    db.ref('/groups/' + state.currentGroup.id + '/members/' + state.currentMember.id + '/cards').update(updates)
  },
  // Sort the cards in currentGroup by importance
  [SORT_BY_IMPORTANCE] (state) {

  },
  [SET_SORT_TYPE] (state, payload) {
    state.sortType = payload
  },









  ...firebaseMutations
}

const actions = {
  // 设置群组
  setPageRef: firebaseAction(({ bindFirebaseRef }, payload) => {
    // 若是我没有猜错，这个groups即State里面的groups，会与其同步
    bindFirebaseRef('groups', payload)
  }),
  setuser ({ commit }, payload) {
    commit(SET_USER, payload)
  },
  setcurrent ({ commit }, payload) {
    commit(SET_CURRENT, payload)
  },
  setLeaderButton ({ commit }, payload) {
    commit(LEADER_BUTTON, payload)
  },
  readgroup ({ commit }, payload) {
    commit(READ_GROUP, payload)
  },
  // 将来应该还有设置卡片等等
  savegroup ({ commit }, payload) {
    commit(ADD_GROUP, payload)
  },
  deletegroup ({ commit }, payload) {
    commit(DELETE_GROUP, payload)
  },
  setgroup ({ commit }, payload) {
    commit(SET_GROUP, payload)
  },
  addmember ({ commit }, payload) {
    commit(ADD_MEMBER, payload)
  },
  deletemember ({ commit }, payload) {
    commit(DELETE_MEMBER, payload)
  },
  addcard ({ commit }, payload) {
    commit(ADD_CARD, payload)
  },
  sortByImportance ({ commit }) {
    commit(SORT_BY_IMPORTANCE)
  },
  setSortType ({ commit }, payload) {
    commit(SET_SORT_TYPE, payload)
  }
}

// export everything as default
export default {
  state,
  getters,
  actions,
  mutations
}

