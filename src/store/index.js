import Vue from 'vue'
import Vuex from 'vuex'

import groups from './modules/groups'

Vue.use(Vuex)

export const store = new Vuex.Store({
  /*
  state: {
    user: ''
  },
  */
  modules: {
    groups
  }
})

// 好吧，其实这玩意没啥卵用。就是说vue.js在develop的时候，修改完的效果是实时反馈在localhost上的
// 用这玩意可以替换掉过热的模块
// 吧
if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/groups'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const groups = require('./modules/groups').default
    // swap in the new actions and mutations
    store.hotUpdate({
      modules: {
        groups
      }
    })
  })
}

