<!-- template, vue的标准格式 -->
<template>
  <!-- 表示开始使用这个app -->
  <v-app light>
    <!-- 此处放main header -->
    <!-- 容器,里面可以包含container -->
    <v-content>
      <!-- 自动与页面调节大小 -->
      <v-container
        fluid>
        <v-layout row >
          <v-flex xs6>
            <navigation/>
          </v-flex>
          <v-flex xs12>
            <router-view/>
          </v-flex>
          <v-flex xs12>
            <Header/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import { groupsDB } from '@/services/firebase.conf'
export default {
  components: { Navigation, Header },
  name: 'App',
    // Combine firebase with this project
  created () {
    this.$store.dispatch('setPageRef', groupsDB)
  },
  computed: {
    currentUser () {
      if (this.$store.getters.getCurrentUser)
        return true
      return false
    }
  }
}
</script>

<style>
</style>
