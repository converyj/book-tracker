import firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
	apiKey: 'AIzaSyBIlXwCd-YEfxWWVZY2QVdtthPhMlTNNj8',
	authDomain: 'book-tracker-b8b02.firebaseapp.com',
	projectId: 'book-tracker-b8b02',
	databaseURL: 'https://book-tracker-b8b02-default-rtdb.firebaseio.com/',
	storageBucket: 'book-tracker-b8b02.appspot.com',
	messagingSenderId: '719744270795',
	appId: '1:719744270795:web:1061ea4874cc88ce80f64e'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
