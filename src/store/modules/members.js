import { SET_MEMBER,
  SAVE_MEMBER,
  DELETE_MEMBER,
  FIND_MEMBER } from '@/store/mutation-types'
import { groupsDB, db } from '@/services/firebase.conf'
import { firebaseMutations, firebaseAction } from 'vuexfire'

/**
 * 这玩意暂时用不到
 * 好像所有的modules必须放在一个js文档里
 */


const state = {
  // 这应该是整个数据库里有多少groups
  newMember: {
    name: '',
    id: '',
    age: ''
  },
  groupID: ''
}

// getters
const getters = {
  getNewMember (state) {
    return state.newMember
  },
  getGroupID (state) {
    return state.groupID
  }
}

const mutations = {
  // 输入成员，可以直接修改firebase里该群的成员
  [SET_MEMBER] (state,payload,id) {
    var updates = {}
    // 直接提取群组的ID并更新firebase里的那个群组
    updates[payload.id] = payload
    db.ref('/groups/' + id + '/members').update(updates)
  },
  // 新建新群组
  [SAVE_MEMBER] (state, payload,id) {
    // 首先输入新的卡片当做payload
    state.newMember.name = payload.name
    state.newMember.age = payload.age
    // 将该群组以没有id的形式推入firebase,并获取这个id
    state.newMember.id = db.ref('/groups/' + id + '/members').push(state.newMember).key
    // 再将这个id更新到groups里面去
    var updates = {}
    updates[state.newMember.id] = state.newMember
    db.ref('/groups/' + id + '/members').update(updates)
  },
  // 输入卡号，删除群组
  [DELETE_MEMBER] (state, payload) {
    membersDB.child(payload).remove()
  },
  [FIND_MEMBER] (state, payload) {

  },
  ...firebaseMutations
}

const actions = {
  // 设置群组
  setMembersRef: firebaseAction(({ bindFirebaseRef }) => {
    bindFirebaseRef('members', membersDB)
  }),
  // 将来应该还有设置卡片等等
  savemember ({ commit }, payload, id) {
    commit(SAVE_MEMBER, payload, id)
  },
  deletemember ({ commit }, payload) {
    commit(DELETE_MEMBER, payload)
  },
  setmember ({ commit }, payload) {
    commit(SET_MEMBER, payload)
  }
}

// export everything as default
export default {
  state,
  getters,
  actions,
  mutations
}

