import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "chatroom-udemy.firebaseapp.com",
  databaseURL: "https://chatroom-udemy.firebaseio.com",
  projectId: "chatroom-udemy",
  storageBucket: "chatroom-udemy.appspot.com",
  messagingSenderId: "478794975017",
  appId: "1:478794975017:web:4e876c76c79227f7765938",
  measurementId: "G-QY9WNJN2Y9"
};

firebase.initializeApp(config);

export default firebase;