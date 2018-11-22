import { initializeApp } from 'firebase'

// Initialize Firebase
export const config = {
  apiKey: "AIzaSyCnqdn6xNYqlRvqN0omjKsWMB32PX6xrtU",
  authDomain: "project-8103f.firebaseapp.com",
  databaseURL: "https://project-8103f.firebaseio.com",
  projectId: "project-8103f",
  storageBucket: "project-8103f.appspot.com",
  messagingSenderId: "291659769367"
}

const app = initializeApp(config)

// firebase本体
export const db = app.database()
// 共分为三层：groups, members, cards
// 此处为最外层: groups
export const groupsDB = db.ref('/groups')
// 使用者
export const authService = app.auth()
