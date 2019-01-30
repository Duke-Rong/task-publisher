<template>
  <div>
    <v-container
      fluid
      class="homeBox"
      style="text-align:center">
      <v-container class="abc">
        <br>
        <h3 style="font-size:30px">Welcome to Task Publisher</h3>
        <br>
        <br>
        <v-card flat>
          <v-layout column>
            <v-flex>
              <v-text-field
              label="Email Address"
              outline
              v-model="email"
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Password"
                outline
                type="password"
              v-model="password"
              ></v-text-field>
            </v-flex>
            <v-card-actions>
            <v-flex>
              <v-btn large
                color="success"
                @click="SignInUser()">
              Log in</v-btn>
            </v-flex>
            <v-flex>
              <v-btn large
                color="info"
                @click="RegisterDialog=true">
              Sign Up</v-btn>
            </v-flex>
            </v-card-actions>
          </v-layout>
        </v-card>
      </v-container>
    </v-container>

    <!-- 当register时显示的对话框 -->
    <v-dialog
    v-model="RegisterDialog"
    max-width="500">
      <v-card
      class="mx-auto"
      max-width="500">
      <!-- 标题，随着windows的变化而变化 -->
      <v-card-title class="title font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary lighten-2"
          class="subheading white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>
      <!-- 需要填入的内容，随着step的变化而变化 -->
      <v-window v-model="step">
        <!-- 第一步，输入email -->
        <v-window-item :value="1">
          <v-card-text>
            <v-text-field
              label="Email"
              v-model="email"
            ></v-text-field>
            <span class="caption grey--text text--darken-1">
              This is the email you will use to login to task publisher
            </span>
          </v-card-text>
        </v-window-item>
        <!-- 第二步，输入密码并确认 -->
        <v-window-item :value="2">
          <v-card-text>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              :rules="PasswordTooShort"
            ></v-text-field>
            <v-text-field
              label="Confirm Password"
              type="password"
              v-model="confirmPassword"
              :rules="PasswordNotSame"
            ></v-text-field>
            <span class="caption grey--text text--darken-1">
              Please enter a password for your account
            </span>
          </v-card-text>
        </v-window-item>
        <!-- 第三步，输入你的用户名 -->
        <v-window-item :value="3">
          <v-card-text>
            <v-text-field
              label="Nick Name"
              v-model="NickName"
            ></v-text-field>
            <span class="caption grey--text text--darken-1">
              This is the nick name that will shown in your group
            </span>
          </v-card-text>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>
      <v-card-actions>
        <!-- close按钮，仅当step = 1时才出现 -->
        <v-btn v-if="step === 1" flat @click="RegisterDialog=false">
          Close
        </v-btn>
        <!-- 两个按钮back和next -->
        <v-btn v-if="step !== 1" flat @click="step--">
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <!-- 这个是第一个step的next -->
        <v-btn v-if="step === 1" color="primary" depressed @click="checkNextStepVaild()">
          Next
        </v-btn>
        <!-- 这个是第二个step的next -->
        <v-btn :disabled="PasswordsNotVaild" v-if="step === 2" color="primary" depressed @click="checkNextStepVaild()">
          Next
        </v-btn>
        <!-- Confirm按钮，仅当step=3时才出现 -->
        <v-btn v-if="step === 3" color="primary" depressed @click="createUser(NickName)">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-dialog>

  </div>
</template>

<script>
import firebase from 'firebase'
export default {
  data () {
    // 登陆者的账号和密码
    return {
      email: '',
      password: '',
      confirmPassword: '',
      NickName: '',
      RegisterDialog: false,
      step: 1,
      // 这个玩意检查两个密码是否一致
      PasswordNotSame: [val => (val || '') === this.password || 'Password not same'],
      // 这个玩意检查在填写密码的时候是否大于六位
      PasswordTooShort: [val => (val || '').length > 5 || 'Password must longer than 6 characters'],
    }
  },
  computed: {
    currentTitle () {
      switch (this.step) {
        case 1: return 'Sign-up'
        case 2: return 'Create a password'
        default: return 'Account created'
      }
    },
    PasswordsNotVaild () {
      if (this.password !== this.confirmPassword || this.password.length < 6 || this.confirmPassword.length < 6)
        return true
    }
  },
  methods: {
    // register
    createUser: function (NickName) {
      // Create an account with email and password
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(function(){
        // After that, update the profile with Nickname
        firebase.auth().currentUser.updateProfile({
          displayName: NickName,
        }).catch(function(error) {
          // If problem happens with the nickname update
          alert(error.message)
        });
      }).catch(function (error) {
        // If problem happens with registeration
        alert(error.message)
      })
      // 清除痕迹
      this.email = ''
      this.password = ''
      this.NickName = ''
      this.RegisterDialog = false
      this.step = 1
    },
    // sign in
    SignInUser: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function (error) {
        alert(error.message)
      })
    },
    validateEmail: function () {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },
    checkNextStepVaild () {
      if (!this.validateEmail()) {
        alert('Please input a vaild email')
      } else {
        this.step++
      }
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
        background-image: url("../assets/background.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .inputbox {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 250px;
    }
    .abc {
        position: absolute;
        left: 25%;
        top: 18%;
        height: 420px;
        width: 700px;
        background-color:white
    }
</style>
