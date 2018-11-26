<template>
  <div>
    Welcome, <br>
    {{ user.email }}
    <br>
    ------------------------
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  name: 'Navigation',
  data () {
    return {
      user: ''
    }
  },
  // 使用用户的email作为名字
  beforeMount () {
    this.setUser()
  },
  mounted () {
    this.setUser()
  },
  methods: {
    // Set the user to the current user of firebase
    setUser: function () {
      this.user = firebase.auth().currentUser
      setTimeout(() => {
        this.user = firebase.auth().currentUser
      }, 500)
    }
  }
}
</script>

