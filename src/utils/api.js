import { objectOf } from 'prop-types';
import firebase from '../firebase';
import { filterByValue } from './../actions/books';

// callback as a Promise
const getData = (ref) => {
	return new Promise((res, rej) => {
		const onError = (error) => rej(error);
		const onData = (snap) => res(snap.val());

		ref.on('value', onData, onError);
	});
};

/* get books from Firebase and return null or books object */
export const getBooks = () => {
	const booksRef = firebase.database().ref('books');
	// consume the promise of getData()
	const books = getData(booksRef)
		.then((value) => {
			return value;
		})
		.catch((error) => console.log(error));
	return books;
};

/* search books using the Google Books API */
export const searchBook = (query) => {
	return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`).then((res) => {
		return res.json().then((data) => {
			return data.items;
		});
	});
};

/* save the added book to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#basic_write
*/
export const saveBook = (book) => {
	// generate new key and set book
	firebase.database().ref('books').push().set(book);
};

/* update book comment to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#update_specific_fields
*/
export const updateComment = (id, comment) => {
	// get the key of the book
	return firebase
		.database()
		.ref('books')
		.orderByChild('id')
		.equalTo(id)
		.once('value')
		.then((snapshot) => {
			let value = snapshot.val();
			if (value) {
				var key = Object.keys(value)[0];
				// update the comment field of book
				return new Promise((res, rej) => {
					var updates = {};
					updates['/books/' + key + '/comment/'] = comment;
					return res(firebase.database().ref().update(updates));
				});
			}
		});
};
export const saveBooksLS = (book) => {
	const books = [];
	books.push(book);
	let bookList = JSON.parse(localStorage.getItem('books'));
	// if bookList already exist
	if (bookList) {
		console.log('exist');
		bookList.push(book);
		localStorage.setItem('books', JSON.stringify(bookList));
	}
	else {
		// if bookList does not exist
		localStorage.setItem('books', JSON.stringify(books));
	}
};
