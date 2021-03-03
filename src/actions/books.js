/* 
Recieve Books by search 
Add Book 
Add Comment  ?
Sort Books 
*/

import { formatBook } from '../utils/helper';
import { saveBooksLS, getBooks, updateComment, saveBook } from './../utils/api';

export const RECIEVE_BOOKS = 'RECIEVE_BOOKS';
export const ADD_BOOK = 'ADD_BOOK';
export const FILTER_BY_VALUE = 'FILTER_BY_VALUE';
export const SORT_BY_AUTHOR = 'SORT_BY_AUTHOR';
export const SORT_BY_DATE = 'SORT_BY_DATE';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';

export const recieveBooks = (books) => {
	return {
		type: RECIEVE_BOOKS,
		books
	};
};

export const addBook = (book) => {
	return {
		type: ADD_BOOK,
		book
	};
};

export const filterByValue = (value) => {
	return {
		type: FILTER_BY_VALUE,
		value
	};
};

export const sortByAuthor = () => {
	return {
		type: SORT_BY_AUTHOR
	};
};

export const sortByDate = () => {
	return {
		type: SORT_BY_DATE
	};
};

export const updateBookComment = (id, comment) => {
	return {
		type: UPDATE_COMMENT,
		id,
		comment
	};
};

/* add book */
export function handleAddBook(book) {
	const formattedBook = formatBook(book);
	console.log(formattedBook);
	return (dispatch) => {
		saveBook(formattedBook);
		dispatch(addBook(formattedBook));
	};
}

/* Get books */
export function handleInitialData() {
	return (dispatch) => {
		getBooks().then((books) => {
			dispatch(recieveBooks(books));
		});
	};
}

/* update book comment */
export const handleBookComment = (id, comment) => {
	return (dispatch) => {
		updateComment(id, comment).then(() => dispatch(updateBookComment(id, comment)));
	};
};
