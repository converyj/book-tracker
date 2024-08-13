import { db } from '../firebase/index';
import { ref, query, orderByChild, equalTo, get, update, push, set } from "firebase/database";

// Generate a unique token for storing user books data on the backend server.
let userID = localStorage.userID;
if (!userID) userID = localStorage.userID = Math.random().toString(36).substr(-8);

const booksRef = ref(db, `users/${userID}/books/`); // Create a reference to the path

// Function to get data from a reference
const getData = async (ref) => {
    try {
        const snapshot = await get(ref);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log('No data available');
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data. Please try again later.');
    }
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
        .catch((error) => alert('Having trouble getting books. Please try again later.'));
};

/* save the added book to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#basic_write
*/
export const saveBook = async (book) => {
    try {
        // Generate a new key and set the book
        const newBookRef = push(booksRef); // Generate a new reference with a unique key
        await set(newBookRef, book); // Set the book data at that reference
        console.log('Book saved successfully');
    } catch (error) {
        console.error('Error saving book:', error);
        throw new Error('Failed to save book. Please try again later.');
    }
};

/* update book comment to Firebase 
https://firebase.google.com/docs/database/web/read-and-write#update_specific_fields
*/
export const updateComment = async (id, comment) => {
    // Create a query to find the book with the specific ID
    const bookQuery = query(booksRef, orderByChild('id'), equalTo(id));

    try {
        // Fetch the book snapshot
        const snapshot = await get(bookQuery);
        const value = snapshot.val();

        if (value) {
            // Get the key of the book
            const key = Object.keys(value)[0];

            // Update the comment field of the book
            const updates = {};
            updates[`/users/${userID}/books/${key}/comment`] = comment;
            await update(ref(db), updates);

            console.log('Comment updated successfully');
        } else {
            console.log('No book found with the specified ID');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
    }
};
