<template>
  <v-toolbar v-show="headerShown"
    color="black"
    dark
    clipped-left>
    <v-spacer></v-spacer>
    <v-btn fab small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
      L
    </v-btn>

    <!-- sort -->
    <v-menu
      :nudge-width="100"
      offset-y
      v-show="currentCardsAvailable">
      <v-btn
        icon
        v-show="currentCardsAvailable"
        slot="activator">
        <v-icon>sort</v-icon>
      </v-btn>
      <v-list>
        <!-- Sort by Create time -->
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="sortByCreateTime" v-on:click="sortBy(0)" color="purple"/>
          </v-list-tile-action>
          <v-list-tile-title>
            Sort By Create time
          </v-list-tile-title>
        </v-list-tile>
        <!-- Sort by importance -->
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="sortByImportance" v-on:click="sortBy(1)" color="purple"/>
          </v-list-tile-action>
          <v-list-tile-title>
            Sort By Importance
          </v-list-tile-title>
        </v-list-tile>
        <!-- Sort by Due date -->
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="sortByDueDate" v-on:click="sortBy(2)" color="purple"/>
          </v-list-tile-action>
          <v-list-tile-title>
            Sort By Due date
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <!-- anti sort -->
    <v-btn icon v-show="currentCardsAvailable" v-on:click="antisort()">anti</v-btn>

    <!-- calendar -->
    <v-btn icon v-on:click="calendar()" v-show="currentCardsAvailable">
      <v-icon>event</v-icon>
    </v-btn>

    <!-- Show Finished tasks -->
    <v-btn icon v-on:click="finish()" v-show="currentCardsAvailable && !currentShowingFinished">
      <v-icon>check_circle_outline</v-icon>
    </v-btn>
    <!-- Show Ongoing tasks -->
    <v-btn icon v-on:click="finish()" v-show="currentCardsAvailable && currentShowingFinished">
      <v-icon>play_circle_outline</v-icon>
    </v-btn>

    <!-- Help button -->
    <v-btn icon @click.stop="help = true">
      <v-icon>help</v-icon>
    </v-btn>
    <v-dialog v-model="help" max-width="1000px">
      <v-card>
        <v-card-title>
          <span>广告位招租！</span>
        </v-card-title>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="help = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-toolbar>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      help: false,
      sortByImportance: false,
      sortByDueDate: false,
      sortByCreateTime: false
    }
  },
  computed: {
    currentUser() {
      if (this.$store.getters.getCurrentUser){
        return this.$store.getters.getCurrentUser
      } else {
        return null
      }
    },
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
    // If current cards are null, some buttons shall not show
    currentCardsAvailable() {
      return this.$store.getters.getCurrentCardsAvailable
    },
    headerShown () {
      if (this.$store.getters.getCurrentGroup)
        return true
      return false
    },
    // 这个开关决定了是展示完成的tasks还是未完成的tasks
    currentShowingFinished() {
      return this.$store.getters.getFinish
    },
  },
  methods: {
    Leader() {
      this.$store.dispatch('setLeaderButton', true)
      this.$store.dispatch('setCurrentCardsToLeaderForm')
    },
    sortBy(payload) {
      this.$store.dispatch('setSortType', payload)
      // set the model
      if (payload == 0){
        this.sortByImportance = false
        this.sortByDueDate = false
        this.sortByCreateTime = true
      } else if (payload == 1){
        this.sortByImportance = true
        this.sortByDueDate = false
        this.sortByCreateTime = false
      } else if (payload == 2){
        this.sortByImportance = false
        this.sortByDueDate = true
        this.sortByCreateTime = false
      }
    },
    antisort() {
      this.$store.dispatch('antisort')
    },
    finish() {
      this.$store.dispatch('changeFinishVision')
    },
    calendar() {
      // this.$router.push('/calendar')
    },
    helpVision() {
      this.help = !this.help
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
