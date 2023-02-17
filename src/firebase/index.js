// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIlXwCd-YEfxWWVZY2QVdtthPhMlTNNj8",
    authDomain: "book-tracker-b8b02.firebaseapp.com",
    databaseURL: "https://book-tracker-b8b02-default-rtdb.firebaseio.com",
    projectId: "book-tracker-b8b02",
    storageBucket: "book-tracker-b8b02.appspot.com",
    messagingSenderId: "719744270795",
    appId: "1:719744270795:web:1061ea4874cc88ce80f64e"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export default app


