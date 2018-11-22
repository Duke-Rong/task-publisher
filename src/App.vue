<!-- template, vue的标准格式 -->
<template>
  <!-- 表示开始使用这个app -->
  <v-app light>
    <!-- LandingPage中的Main header, 按钮就在那个vue里面 -->
    <!-- 里面的三个parameter仅控制了左上角显示什么，包括tasks和tasks done -->
    <!-- 容器,里面可以包含container -->
    <v-content>
      <!-- 自动与页面调节大小 -->
      <v-container
        fluid
        fill-height>
        <!-- 排列方法 -->
        <v-layout
          justify-center
          align-center>
          <transition>
            <keep-alive>
              <!-- 导入router -->
              <router-view/>
            </keep-alive>
          </transition>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { groupsDB } from '@/services/firebase.conf'
export default {
  name: 'App',
    // Combine firebase with this project
  created () {
    this.$store.dispatch('setPageRef', groupsDB)
  },
}
</script>

<style>
</style>
