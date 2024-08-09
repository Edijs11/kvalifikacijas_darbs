import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "hello",
  authDomain: "volejbols-18ab9.firebaseapp.com",
  databaseURL: "https://volejbols-18ab9.firebaseio.com",
  projectId: "volejbols-18ab9",
  storageBucket: "volejbols-18ab9.appspot.com",
  messagingSenderId: "363903746423",
  appId: "1:363903746423:web:ac4307bf1e04c89067a172",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export { firebase, db };
