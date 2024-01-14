// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZPmkP2K2HYuwjS333fSNOhYki6020I0M",
  authDomain: "wmmad-lets.firebaseapp.com",
  projectId: "wmmad-lets",
  storageBucket: "wmmad-lets.appspot.com",
  messagingSenderId: "522378822496",
  appId: "1:522378822496:web:95e69d939e9fa5979a1405",
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

export { firebase, auth };
