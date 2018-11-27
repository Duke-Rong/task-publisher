<template>
  <div>
    <!-- 当一般情况下，显示单人的卡片 -->
    <div v-show="!currentShowingLeader">
      Cards under this guy:
      <button v-on:click="addCard()">Add</button>
      <li
      v-for="(cards,cardsIndex) in currentCards"
      :key="cardsIndex">
        {{ cards.name }}
        {{ cards.description }}
      </li>

      <v-dialog
      v-model="currentAddingCards">
        Card name: <input type="text" v-model="newCard.name"><br>
        Card description: <input type="text" v-model="newCard.description"><br>
        <button v-on:click="confirmAddingThisCard">OK</button>
      </v-dialog>
    </div>

    <!-- 当leader按钮被按下后，显示该组内所有人卡片 -->
    <div
    v-show="currentShowingLeader">
      <div
      v-for="(members,memberIndex) in currentGroup.members"
      :key="memberIndex">
        Member: {{ members.name }}
        <li
        v-for="(cards,cardsIndex) in members.cards"
        :key="cardsIndex">
          {{ cards.name }}
          {{ cards.description }}
        </li>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  /**
   * 在本component中，所有的数据均来自store里的current家族
   * 存储修改也是直接call setCurrent
   */
  name: 'Cards',
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
        description: ''
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
        return this.$store.getters.getCurrentCards
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
        description: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
