<!-- template, vue的标准格式 -->
<template>
  <!-- 表示开始使用这个app -->
  <v-app light>
    <v-container fluid pa-0>
      <v-layout row wrap>
        <v-flex xs3>
          <v-container fluid pa-0>
              <div class="first">
                <navigation/>
              </div>
          </v-container>
        </v-flex>

        <v-flex>
          <v-container fluid pa-0>
            <div class="second">
              <v-layout column>
                <v-flex>
                  <Header/>
              </v-flex>
                <v-flex>
                  <router-view/>
                </v-flex>
              </v-layout>
              </div>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import { groupsDB } from '@/services/firebase.conf'
import firebase from 'firebase';
export default {
  components: { Navigation, Header },
  name: 'App',
  // Combine firebase with this project
  created () {
    this.$store.dispatch('setPageRef', groupsDB)
  },
  computed: {
    user() {
      if (this.$store.getters.getCurrentUser) {
        return true
      return false
      }
    }
  }
}
</script>

<style scoped>
    .first {
      position: absolute;
      width: 25%;
      height: 100%;
      background-color: hsl(175, 100%, 50%);
      background-size: 100% 100%;
    }
    .second {
      position: absolute;
      width: 76%;
      height: 100%;
      background-image: url("assets/mainPage.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
</style>
