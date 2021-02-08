import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC8kUX1QP5d0_QvqnCnVkVCy-5RoVmWjXQ",
  authDomain: "nevtinder.firebaseapp.com",
  databaseURL: "https://nevtinder-default-rtdb.firebaseio.com",
  projectId: "nevtinder",
  storageBucket: "nevtinder.appspot.com",
  messagingSenderId: "984462872094",
  appId: "1:984462872094:web:2ef66589c9eb3375fe280f"
};

// Initialize Firebase
module.exports = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
