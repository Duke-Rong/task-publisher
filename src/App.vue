<!-- template, vue的标准格式 -->
<template>
  <!-- 表示开始使用这个app -->
  <v-app light>
    <router-view/>
  </v-app>
</template>

<script>
import Navigation from '@/components/Navigation'
import { groupsDB } from '@/services/firebase.conf'
export default {
  components: { Navigation },
  name: 'App',
    // Combine firebase with this project
  created () {
    this.$store.dispatch('setPageRef', groupsDB)
  },
}
</script>

<style>
</style>
