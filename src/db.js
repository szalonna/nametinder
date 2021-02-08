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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.app().database();

export function createSubtinder(id, gender) {
  return db.ref(`${id}/`).set({
    created: Date.now(),
    gender,
    ids: {}
  });
}

export function userExists(id, uid) {
  return db
    .ref(`${id}/users/${uid}/`)
    .once("value")
    .then((snapshot) => snapshot.val());
}

export function addUser(id, uid) {
  console.log(id, uid);
  return db.ref(`${id}/users/${uid}/`).set({
    created: Date.now()
  });
}
