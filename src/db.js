import firebase from "@firebase/app";
import "@firebase/database";
import "@firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC8kUX1QP5d0_QvqnCnVkVCy-5RoVmWjXQ",
  authDomain: "nevtinder.firebaseapp.com",
  databaseURL: "https://nevtinder-default-rtdb.firebaseio.com",
  projectId: "nevtinder",
  storageBucket: "nevtinder.appspot.com",
  messagingSenderId: "984462872094",
  appId: "1:984462872094:web:2ef66589c9eb3375fe280f",
  measurementId: "G-KX5QLW4QP5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
firebase.analytics();

const db = firebase.app().database();

export function subtinderExists(id) {
  return db
    .ref(`${id}/`)
    .once("value")
    .then((snapshot) => !!snapshot.val());
}

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
    .then((snapshot) => !!snapshot.val());
}

export function addUser(id, uid) {
  return db.ref(`${id}/users/${uid}/`).set({
    created: Date.now()
  });
}

export function nameOk(id, uid, name) {
  return db.ref(`${id}/users/${uid}/ok`).push(name);
}

export function nameNah(id, uid, name) {
  return db.ref(`${id}/users/${uid}/nah`).push(name);
}

export function onNameListChange(id, uid, cb) {
  db.ref(`${id}/users/${uid}/`).on("value", (data) => {
    cb(data.val());
  });
}

export function getResults(id) {
  return db
    .ref(`${id}/users/`)
    .once("value")
    .then((snapshot) => snapshot.val())
    .then((val) => {
      return Object.keys(val).reduce((acc, userId) => {
        if (!val[userId].ok) {
          return acc;
        }

        Object.values(val[userId].ok).forEach((name) => {
          acc[name] = (acc[name] || 0) + 1;
        });
        return acc;
      }, {});
    })
    .then((namesWithVote) => {
      return Object.keys(namesWithVote).reduce((acc, name) => {
        if (namesWithVote[name] > 1) {
          return [...acc, name];
        }
        return acc;
      }, []);
    });
}
