<template>
  <v-container fluid pa-0 class="outside">
    <div class="inside">
      <full-calendar
        :config="config"
        :events="newcard"/>
    </div>
  </v-container>
</template>

<script>
// Import calendar as a plugin
import { FullCalendar } from 'vue-full-calendar'
import firebase from 'firebase'
// CSS
import 'fullcalendar/dist/fullcalendar.min.css'
export default {
  components: {
    FullCalendar
  },
  data () {
    return {
      config: {
        editable: false,
        selectable: false,
        eventColor: 'orange',
        defaultView: 'month'
      }
    }
  },
  computed: {
    currentCards() {
      if (this.$store.getters.getCurrentCards){
        return this.$store.getters.getCurrentCards
      } else {
        return null
      }
    },
    newcard () {
      const newcardToReturn = []
      for (var cards in this.currentCards){
        // new card
        var tempNewCard = {}
        // old card
        const card = this.currentCards[cards]
        // show the correct vision: finished or on going
        if (card.finished === this.currentShowingFinished) {
          // Copy the title and start time
          tempNewCard.title = card.name
          tempNewCard.start = card.dueDate
          // Now if the event also has time or description, add it into the card as well
          if (card.description) {
            tempNewCard.description = card.description
          }
          if (card.time) {
          // Since the event cannot show correctly with the time from "0 AM" to "10 AM",
          // We have to make a new Date
            tempNewCard.start = new Date(tempNewCard.start + ' ' + card.time)
          }
          newcardToReturn[newcardToReturn.length] = tempNewCard
          }
        }
        return newcardToReturn



/*
      return this.$store.getters.getCurrentCards.map((card) => {
        const newcard = {}
        // show the correct vision: finished or on going
        if (card.finished === this.currentShowingFinished) {
          if (card.name && card.dueDate) {
          // Copy the title and start time
            newcard.title = card.name
            newcard.start = card.dueDate
            // Now if the event also has time or description, add it into the card as well
            if (card.description) {
              newcard.description = card.description
            }
            if (card.time) {
            // Since the event cannot show correctly with the time from "0 AM" to "10 AM",
            // We have to make a new Date
              newcard.start = new Date(newcard.start + ' ' + card.time)
              console.log(newcard.start)
            }
          }
        } // else, 不show
        return newcard
      })
      */
    },
    // 这个开关决定了是展示完成的tasks还是未完成的tasks
    currentShowingFinished() {
      return this.$store.getters.getFinish
    },
  }
}

</script>

<style>
  .outside {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: aliceblue
  }
  .inside {
    position: absolute;
    top: 60px;
    left: 30px;
    right: 30px;
  }
</style>

