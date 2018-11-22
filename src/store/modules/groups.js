import { READ_GROUP,
  SET_GROUP,
  ADD_GROUP,
  DELETE_GROUP,
  ADD_MEMBER} from '@/store/mutation-types'
import { groupsDB, db } from '@/services/firebase.conf'
import { firebaseMutations, firebaseAction } from 'vuexfire'

const state = {
  // 这应该是整个数据库里有多少groups
  groups: [],
  // groups
  newgroup: {
    name: '',
    id: '',
    members: []
  },
  // members
  newMember: {
    name: '',
    id: ''
  }
  // cards
}

// getters
const getters = {
  getGroups (state) {
    return state.groups
  },
  getNewGoup (state) {
    return state.newgroup
  }
}

const mutations = {
  // 输入：groupID 输出：该group
  // 这玩意好像没啥用处
  [READ_GROUP] (state) {
    groupsDB.child(state.currentGroupID).once('value').then(function (snapshot) {
      var value = snapshot.val()
      value.id = state.currentGroupID
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
    // 将该群组以没有id的形式推入firebase,并获取这个id
    state.newgroup.id = groupsDB.push(state.newgroup).key
    // 这样一来，我们就获取了新的group,包含了完整的id和name
    // 然后将这个完整的group再更新进firebase,替换掉原本没有id的group
    var updates = {}
    updates[state.newgroup.id ] = state.newgroup
    groupsDB.update(updates)
  },
  // 输入卡号，删除群组
  [DELETE_GROUP] (state, payload) {
    groupsDB.child(payload).remove()
  },
  // 由Add传递。payload内含需要增加的组员和群id
  [ADD_MEMBER] (state, payload) {
    // 获取新组员名字.
    state.newMember.name = payload[1]
    // 将其push进该组，并用同样的方法获取member id
    state.newMember.id = db.ref('/groups/' + payload[0] + '/members').push(state.newMember).key
    // 替换掉没有id的members
    var updates = {}
    updates[state.newMember.id] = state.newMember
    db.ref('/groups/' + payload[0] + '/members').update(updates)
  },










  ...firebaseMutations
}

const actions = {
  // 设置群组
  setPageRef: firebaseAction(({ bindFirebaseRef }, payload) => {
    // 若是我没有猜错，这个groups即State里面的groups，会与其同步
    bindFirebaseRef('groups', payload)
  }),
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
  setmember ({ commit }, payload) {
    commit(ADD_MEMBER, payload)
  }
}

// export everything as default
export default {
  state,
  getters,
  actions,
  mutations
}

