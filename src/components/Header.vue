<template>
  <v-toolbar
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
         <!-- Sort by Member -->
        <v-list-tile>
          <v-list-tile-action>
            <v-switch v-model="sortByMember" v-on:click="sortBy(3)" color="purple"/>
          </v-list-tile-action>
          <v-list-tile-title>
            Sort By Member name
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
    <v-btn icon v-on:click="finish()" v-show="currentCardsAvailable">
      <v-icon>{{ currentShowingFinished ? 'play_circle_outline' : 'check_circle_outline' }}</v-icon>
    </v-btn>

    <!-- Help button -->
    <v-btn icon @click.stop="help = true">
      <v-icon>help</v-icon>
    </v-btn>
    <v-dialog v-model="help" max-width="1000px">
      <v-card>
        <v-card-text>
          <h2 style="text-align:center"> Welcome to Task Publisher! </h2>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            Task Publisher is a tool for working groups, help them
            divide the work more clearly and efficiently. Group Leader can create
            a group to include the group members and assign tasks to each members
            so everyone knows their job clearly.
          </p>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: View your profile </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            After your registeration, you can click your email
            shown at the left-top to view your profile.
          </p>
          <div style="text-align:center">
            <img src="../assets/0.png" height="500" width="800">
          </div>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: Create and manage a group </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            As a group leader, you need to create a group to include your members</p>
          <div style="text-align:center">
            <img src="../assets/1.png" height="500" width="800">
          </div>
          <br>
          &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
          <v-btn icon><v-icon>toc</v-icon></v-btn>&emsp;
          <span style="font-size:130%;"> : After create a group, you will see this button beside the group.
            Click this button to manage your group.
          </span>
          <div style="text-align:center">
            <br>
            <img src="../assets/2.png" height="500" width="800">
          </div>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: Add member / Join into a group </h3>
          <br>
          <span style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            There are two ways to include a member into your group.</span>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            First one is give the group id to your member so he can join the group using the "join into a group".
            Group id could be found in the management page. </p>
          <div style="text-align:center">
            <img src="../assets/3.png" height="500" width="800">
          </div>
          <br>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            The other way is to use the "add member" button in the management page.
            In this way, you will need your member's user id.</p>
          <div style="text-align:center">
            <img src="../assets/4.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            As a member, you can either give your user id (which can be found in your profile page)
             to your leader and wait to be included, or you can use the "join into group" button and
             input the group id you got from the group owner</p>
          <div style="text-align:center">
            <img src="../assets/15.png" height="500" width="800">
          </div>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: Change group name / group display name </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            As a leader, you can change the name of the group in the group management page </p>
          <div style="text-align:center">
            <img src="../assets/5.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            As a member, you can change your display name in the group </p>
          <div style="text-align:center">
            <img src="../assets/6.png" height="500" width="800">
          </div>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: Quit a group </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            Press the <v-btn icon><v-icon>cancel</v-icon></v-btn>
            beside your display name in the group to quit. </p>
          <div style="text-align:center">
            <img src="../assets/7.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            If you are the group owner, you will need to choose the new group owner.</p>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> How to: Publish tasks </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            After you choose one member, his tasks will appear in the main frame.
            Press the <v-btn small dark color="blue-grey darken-2" ripple round><v-icon>add</v-icon></v-btn>
            button under his name to add a task. </p>
          <div style="text-align:center">
            <img src="../assets/8.png" height="500" width="800">
          </div>
          <br>
          <div style="text-align:center">
            <img src="../assets/9.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            A task includes title, description, importance and deadline. </p>
          <span style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            Also, a task could be edited (by the group owner or
            the member the task was assigned to), marked as finish and deleted. </span>
          <div style="text-align:center">
            <br>
            <img src="../assets/10.png" height="500" width="800">
          </div>
          <br>
          <br>
          <br>
          <br>
          <h3 style="text-align:center"> Header </h3>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <v-btn fab dark small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
              L
            </v-btn>
            : This button will appear if you are the owner of the group.
            Click this button and cards under every member will show up. </p>
          <div style="text-align:center">
            <img src="../assets/12.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            Task publisher provides some functionalities to help users manage their tasks more efficiently. </p>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <v-btn fab dark small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
              <v-icon>sort</v-icon>
            </v-btn> : user can sort their tasks by different orders:
            create time, importance, due date and assigned member. </p>
          <div style="text-align:center">
            <img src="../assets/11.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <v-btn fab dark small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
              ANTI
            </v-btn> Sort by anti order</p>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <v-btn fab dark small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
              <v-icon>event</v-icon>
            </v-btn> : Task Publisher provides a calendar view for user
            to check the deadline in a more direct way </p>
          <div style="text-align:center">
            <img src="../assets/13.png" height="500" width="800">
          </div>
          <br>
          <p style="font-size:130%;">&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <v-btn fab dark small v-on:click="Leader" v-show="currentCardsAvailable && currentGroup.groupLeader === currentUser.uid">
              <v-icon>play_circle_outline</v-icon>
            </v-btn> : The page will show the tasks that have been
            marked as finished after this button is pressed </p>
          <div style="text-align:center">
            <img src="../assets/14.png" height="500" width="800">
          </div>
          <br>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
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
      sortByCreateTime: false,
      sortByMember: false
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
    // 是否正在阅览calendar
    currentViewingCalendar() {
      return this.$store.getters.getViewCalendar
    }
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
        this.sortByMember = false
      } else if (payload == 1){
        this.sortByImportance = true
        this.sortByDueDate = false
        this.sortByCreateTime = false
        this.sortByMember = false
      } else if (payload == 2){
        this.sortByImportance = false
        this.sortByDueDate = true
        this.sortByCreateTime = false
        this.sortByMember = false
      } else if (payload == 3){
        this.sortByImportance = false
        this.sortByDueDate = false
        this.sortByCreateTime = false
        this.sortByMember = true
      }
    },
    antisort() {
      this.$store.dispatch('antisort')
    },
    finish() {
      this.$store.dispatch('changeFinishVision')
    },
    calendar() {
      // If at main page, go to calendar
      if (this.currentViewingCalendar){
        this.$router.push('/calendar')
      } else {
        // if viewing calendar, back to main page
        this.$router.push('/mainpage/' + this.currentMember.id)
      }
      // change the calendar view
      this.$store.dispatch('viewcalendar')
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
