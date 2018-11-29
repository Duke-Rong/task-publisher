<!-- template, vue的标准格式 -->
<template>
  <!-- 表示开始使用这个app -->
  <v-app light>
    <div v-if="user">
      <v-container fluid pa-0>
        <v-layout row>
          <v-flex>
          <navigation/>
          </v-flex>
          <v-layout column>
            <v-flex>
              <Header/>
            </v-flex>
            <v-flex>
              <router-view/>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-container>
    </div>
    <div v-else>
      <router-view/>
    </div>
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

<style>
</style>
