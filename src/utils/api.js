import firebase from '../firebase';
import 'firebase/database'

// Generate a unique token for storing user books data on the backend server.
let userID = localStorage.userID;
if (!userID) userID = localStorage.userID = Math.random().toString(36).substr(-8);

const booksRef = firebase.database().ref('users/' + userID + '/books/');

// get snapshot of all books as a Promise
const getData = (ref) => {
    return new Promise((res, rej) => {
        const onError = (error) => rej(error);
        const onData = (snap) => res(snap.val());

        ref.on('value', onData, onError);
    });
};

/* get books from Firebase and return null or books object */
export const getBooks = () => {
    // consume the promise of getData()
    const books = getData(booksRef)
        .then((value) => {
            return value;
        })
        .catch((error) => alert('Having trouble getting books. Please try again later.'));
    return books;
};

/* search books using the Google Books API */
export const searchBook = (query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then((res) => res.json())
        .then((data) => data.items)
        .catch((error) => alert('Having trouble fetching books. Please try again later.'));
};

/* get book by volume using the Google Books API */
export const getBookByVolume = (volume, query) => {
    return fetch(`https://www.googleapis.com/books/v1/volumes/${volume}?q=${query}`)
        .then((res) => res.json())
        .then((data) => data)
        .catch((error) => alert('Having trouble fetching books. Please try again later.'));
};

/* save the added book to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#basic_write
*/
export const saveBook = (book) => {
    // generate new key and set book
    return new Promise((res, rej) => res(booksRef.push().set(book)));
};

/* update book comment to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#update_specific_fields
*/
export const updateComment = (id, comment) => {
    // get the key of the book
    return firebase
        .database()
        .ref(booksRef)
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
                    updates['/users/' + userID + '/books/' + key + '/comment/'] = comment;
                    return res(firebase.database().ref().update(updates));
                });
            }
        });
};
