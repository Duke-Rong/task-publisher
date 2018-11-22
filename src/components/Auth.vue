<template>
  <v-container
    fluid
    class="homeBox"
    style="text-align:center">
    <div class="inputbox">
      <div>
        Email:
        <input
          type="text"
          style="border:none; border-bottom:black solid 1px; width:300px;"
          v-model="email">
      </div>
      <br>
      <div>
        Password:
        <input
          type="password"
          style="border:none; border-bottom:black solid 1px; width:300px"
          v-model="password">
      </div>
      <br>
      <v-btn
        color="success"
        @click="SignInUser()">
      Sign-in</v-btn>
      <v-btn
        color="info"
        @click="createUser()">
      Register</v-btn>
    </div>
  </v-container>
</template>

<script>
import firebase from 'firebase'
export default {
  data () {
    // 登陆者的账号和密码
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    // register
    createUser: function () {
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function (error) {
        alert(error.message)
      })
      // 清除痕迹
      this.email = ''
      this.password = ''
    },
    // sign in
    SignInUser: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function (error) {
        alert(error.message)
      })
    }
  }
}
</script>

<style scoped>
    .homeBox {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0px;
        background-image: url("../assets/logo.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .inputbox {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 250px;
    }
</style>
