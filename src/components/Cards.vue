<template>
  <div>
    <v-card color="blue-grey darken-2" class="white--text" max-width="750px">
      <v-layout row>
        <v-flex>
          <v-card-title primary-title>
            <v-layout column>
              <div class="headline">{{ card.name }}</div>
              <!-- if there is a time for the card, show it in the short view -->
              <div v-show="card.dueTime !== ''">Deadline: {{ card.dueDate }}, {{ card.dueTime }}</div>
              <!-- Otherwise, only show the deadline -->
              <div v-show="card.dueTime === ''">Deadline: {{ card.dueDate }}</div>
              <!-- Following only show when the cards are open -->
              <v-slide-y-transition>
                <v-layout column v-show="cardDetails">
                  <div>Description: {{ card.description }}</div>
                    <v-layout
                      row>
                      <v-flex xs1>Importance:</v-flex>
                      <v-icon
                          v-show="card.importance > 0"
                          color="yellow">star</v-icon>
                        <v-icon
                          v-show="card.importance > 1"
                          color="yellow">star</v-icon>
                        <v-icon
                          v-show="card.importance > 2"
                          color="yellow">star</v-icon>
                        <v-icon
                          v-show="card.importance > 3"
                          color="yellow">star</v-icon>
                        <v-icon
                          v-show="card.importance > 4"
                          color="yellow">star</v-icon>
                      </v-layout>
                </v-layout>
              </v-slide-y-transition>
            </v-layout>
          </v-card-title>
        </v-flex>
        <v-spacer></v-spacer>

        <v-card-actions v-show="card.ownerUid === currentUser">
            <v-btn icon @click="cardDetails = !cardDetails">
                <v-icon>{{ cardDetails ? 'keyboard_arrow_up' : 'reorder' }}</v-icon>
            </v-btn>
              <v-btn icon @click="changeEditing()">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn icon @click="finish()">
                <v-icon>{{ card.finished ? 'settings_backup_restore' : 'thumb_up'}}</v-icon>
              </v-btn>
              <v-btn icon @click="Delete()">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>

      </v-layout>
    </v-card>


  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'MainPage',
  props: { card: Object },
  data() {
    return {
      cardDetails: false
    }
  },
  computed: {
    currentUser() {
      return firebase.auth().currentUser.uid
    }
  },
  methods: {
    // Press this button means the task is finished
    // Move it to the finished place
    finish() {
      this.card.finished = !this.card.finished
      this.$store.dispatch('updateCard',this.card)
    },
    Delete() {
      var r = confirm('Are you sure to delete this card?')
      if (r)
        this.$store.dispatch('deleteCard',this.card)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
