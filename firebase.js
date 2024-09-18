// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZmJa1irSER_lvedF4TFstgICLb_Smwuk",
  authDomain: "pandemicgame-3da86.firebaseapp.com",
  projectId: "pandemicgame-3da86",
  storageBucket: "pandemicgame-3da86.appspot.com",
  messagingSenderId: "926388450115",
  appId: "1:926388450115:web:8ea8bb6110704f65e0b5f6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
