
//Configuration for firebase database and storage
import firebase from 'firebase'

  const firebaseConfig = {
    apiKey: "AIzaSyBd42LAeU3rtUKAjA9F605A0aHCnnLarWw",
    authDomain: "auction-app-8fba4.firebaseapp.com",
    databaseURL: "https://auction-app-8fba4-default-rtdb.firebaseio.com",
    projectId: "auction-app-8fba4",
    storageBucket: "auction-app-8fba4.appspot.com",
    messagingSenderId: "538513291210",
    appId: "1:538513291210:web:3074b230f0b48fd2bf8133"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase;