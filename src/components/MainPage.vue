<template>
  <div>
    <!-- 当一般情况下，显示单人的卡片 -->
    <div v-show="!currentShowingLeader">
      Cards under this guy:
      <button v-on:click="addCard()">Add</button>
      <li
      v-for="(cards,cardsIndex) in currentCards"
      :key="cardsIndex">
        <cards v-bind:card="cards"/>
      </li>
    </div>

    <!-- 当leader按钮被按下后，显示该组内所有人卡片 -->
    <!-- sort仅对currentCards有效，对leader无效 -->
    <div
    v-show="currentShowingLeader">
      <div
      v-for="(members,memberIndex) in currentGroup.members"
      :key="memberIndex">
        Member: {{ members.name }}
        <button v-on:click="sortByImportance()">SBI</button>
        <li
        v-for="(cards,cardsIndex) in members.cards"
        :key="cardsIndex">
          <cards v-bind:card="cards"/>
        </li>
      </div>
    </div>

    <v-dialog
    v-model="currentAddingCards">
      Card name: <input type="text" v-model="newCard.name"><br>
      Card description: <input type="text" v-model="newCard.description"><br>
      Card due Date: <input type="text" v-model="newCard.dueDate"><br>
      Card due time: <input type="text" v-model="newCard.dueTime"><br>
      Card importance: <input type="text" v-model="newCard.importance"><br>
      <button v-on:click="confirmAddingThisCard">OK</button>
    </v-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Cards from '@/components/Cards'
export default {
  components: { Cards },
  /**
   * 在本component中，所有的数据均来自store里的current家族
   * 存储修改也是直接call setCurrent
   */
  name: 'MainPage',
  data() {
    return {
      // group
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
      },
      // 这个开关决定了当前是否在增加cards
      currentAddingCards: false
    }
  },
  // 凡是和store有关的东西都在这里
  // 理论上他应该是自动更新的
  computed: {
    currentGroup() {
      if (this.$store.getters.getCurrentGroup){
        return this.$store.getters.getCurrentGroup
      } else {
        return null
      }
    },
    currentMember() {
      if (this.$store.getters.getCurrentMember){
        return this.$store.getters.getCurrentMember
      } else {
        return null
      }
    },
    currentCards() {
      if (this.$store.getters.getCurrentCards){
        // sort here
        return this.sortTheCards(this.$store.getters.getCurrentCards)
        // return this.$store.getters.getCurrentCards
      } else {
        return null
      }
    },
    // 这个开关决定了是否按下了leader按钮
    currentShowingLeader() {
      return this.$store.getters.getLeaderButtonPushed
    }
  },
  watch: {
    /**
    '$route' (to, from) {

    }
    currentGroup (newer, older) {

    },
    currentMember (newer, older) {

    },
    currentCards (newer, older) {

    },
    */
  },
  methods: {
    addCard() {
      this.clearNewCard()
      this.currentAddingCards = !this.currentAddingCards
    },
    confirmAddingThisCard() {
      this.$store.dispatch('addcard', this.newCard)
      this.addCard()
    },
    // Sort the cards depending on which sort user wants
    sortTheCards(cardsToBeSort) {
      const sortType = this.$store.getters.getSortType
      const antisort = this.$store.getters.getAntiSort
      // 由于不能直接对currentCards进行sort，
      // 要将其先置于一个可以sort的地方
      var tempCurrentCards = []
      for (var cards in cardsToBeSort){
        // 读取每张currentCards并将他塞入一个新建的array
        tempCurrentCards[tempCurrentCards.length] = cardsToBeSort[cards]
      }
      // compare based on the sort type
      // pay attention to anti-sort or not!
      function compare (a, b) {
        if (sortType === 1) {
          if (a.importance > b.importance) {
            if (antisort) { return 1 } else { return -1 }
          }
          if (a.importance < b.importance) {
            if (antisort) { return -1 } else { return 1 }
          }
        } else if (sortType === 2) {
          if (new Date(a.dueDate + ' ' + a.dueTimee) < new Date(b.dueDate + ' ' + b.dueTime)) {
            if (antisort) { return 1 } else { return -1 }
          }
          if (new Date(a.dueDate + ' ' + a.dueTime) > new Date(b.dueDate + ' ' + b.dueTime)) {
            if (antisort) { return -1 } else { return 1 }
          }
        } else if (sortType === 0) {
          if (a.addTime < b.addTime) {
            if (antisort) { return 1 } else { return -1 }
          }
          if (a.addTime > b.addTime) {
            if (antisort) { return -1 } else { return 1 }
          }
        }
        return 0
      }
      tempCurrentCards.sort(compare)
      return tempCurrentCards
    },
    /**
     * 清除
     */
    clearNewGroup: function() {
      this.newgroup = {
        name: '',
        id: '',
        groupLeader: '',
        members: []
      }
    },
    clearNewMember: function() {
      this.newMember = {
        name: '',
        id: '',
        uid: '',
        cards: []
      }
    },
    clearNewCard: function() {
      this.newCard =  {
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
