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
                      <v-flex xs3>Importance:</v-flex>
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

        <v-card-actions v-show="card.ownerUid === currentUser || currentGroup.groupLeader === currentUser">
            <v-btn icon @click="cardDetails = !cardDetails">
                <v-icon>{{ cardDetails ? 'keyboard_arrow_up' : 'reorder' }}</v-icon>
            </v-btn>
            <v-btn icon @click="openEditingDialog()">
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

    <!-- Edit card -->
    <v-dialog
    v-model="editCards"
    max-width="500px">
      <v-card>
        <v-layout
          column>
          <v-flex xs12>
            <v-card>
              <v-layout column>
                <v-flex xs10>
                  <v-card-title primary-title>
                    <v-layout column>
                      <div class="headline">
                        Task Title:
                        <span v-if="refreshThePage"></span>
                        <v-text-field  v-model="duplicatedCard.name" required clearable=""></v-text-field>
                      </div>
                      <br>
                      <div class="headline">
                        Description:
                        <v-text-field  v-model="duplicatedCard.description" required clearable=""></v-text-field>
                      </div>
                      <br>
                      <div class="headline">
                        Due Date:
                        <v-text-field  v-model="duplicatedCard.dueDate" required clearable=""></v-text-field>
                      </div>
                      <br>
                      <div class="headline">
                        Done by:
                        <v-text-field  v-model="duplicatedCard.dueTime" required clearable=""></v-text-field>
                      </div>
                      <br>
                      <div class="headline">
                        Importance:
                        <v-btn
                          icon
                          @click="changeImportance(1)">
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance > 0">
                          star</v-icon>
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance < 1">
                          star_border</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          @click="changeImportance(2)">
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance > 1">
                          star</v-icon>
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance < 2">
                          star_border</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          @click="changeImportance(3)">
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance > 2">
                          star</v-icon>
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance < 3">
                          star_border</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          @click="changeImportance(4)">
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance > 3">
                          star</v-icon>
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance < 4">
                          star_border</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          @click="changeImportance(5)">
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance > 4">
                          star</v-icon>
                          <v-icon
                            color="red"
                            v-if="duplicatedCard.importance < 5">
                          star_border</v-icon>
                        </v-btn>
                      </div>
                    </v-layout>
                  </v-card-title>
                </v-flex>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-flex/>
                  <v-btn
                    color="success"
                    @click="submitEditing()">
                  SUBMIT</v-btn>
                  <v-btn
                    color="error"
                    @click="RecoverEditingCard()">
                  RECOVER</v-btn>
                  <v-btn
                    color="info"
                    @click="Discard()">
                  DISCARD</v-btn>
                </v-card-actions>
              </v-layout>

            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'MainPage',
  props: { card: Object },
  data() {
    return {
      // Show the detail or not
      cardDetails: false,
      // Open/close the edit card dialog
      editCards: false,
      // duplicate a card for discard
      duplicatedCard: {
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        imortance: ''
      },
      // update the page manually
      refreshThePage: false
    }
  },
  computed: {
    currentGroup() {
      return this.$store.getters.getCurrentGroup
    },
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
    // delete this card
    Delete() {
      var r = confirm('Are you sure to delete this card?')
      if (r)
        this.$store.dispatch('deleteCard',this.card)
    },
    // open the add card dialog
    openEditingDialog() {
      this.editCards = true
      this.RecoverEditingCard()
    },
    // update the card
    submitEditing() {
      this.card.name = this.duplicatedCard.name
      this.card.description = this.duplicatedCard.description
      this.card.dueDate = this.duplicatedCard.dueDate
      this.card.dueTime = this.duplicatedCard.dueTime
      this.card.importance = this.duplicatedCard.importance
      this.editCards = false
      this.RecoverEditingCard()
    },
    // change importance
    changeImportance(payload) {
      this.refreshThePage = !this.refreshThePage
      this.duplicatedCard.importance = payload
    },
    // recover the regular card
    RecoverEditingCard() {
      this.duplicatedCard.name = this.card.name
      this.duplicatedCard.description = this.card.description
      this.duplicatedCard.dueDate = this.card.dueDate
      this.duplicatedCard.dueTime = this.card.dueTime
      this.duplicatedCard.importance = this.card.importance
    },
    // Close the dialog and clear the card
    Discard() {
      this.editCards = false
      this.duplicatedCard = {
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        imortance: ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
