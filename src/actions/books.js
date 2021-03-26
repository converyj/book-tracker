/* 
Recieve Books by search 
Add Book 
Add Comment  ?
Sort Books 
*/

import { hideLoading, showLoading } from 'react-redux-loading';
import { formatBook } from '../utils/helper';
import { saveBooksLS, getBooks, updateComment, saveBook } from './../utils/api';

export const LOAD_NEW_PAGE = 'LOAD_NEW_PAGE';
export const LOAD_EXACT_PAGE = 'LOAD_EXACT_PAGE';
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

export const loadNewPage = (payload) => {
	return {
		type: LOAD_NEW_PAGE,
		payload
	};
};

export const loadExactPage = (payload) => {
	return {
		type: LOAD_EXACT_PAGE,
		payload
	};
};

/* add book */
export function handleAddBook(book) {
	const formattedBook = formatBook(book);
	return (dispatch) => {
		alert('You are about to add book that exists in your book list');
		dispatch(showLoading());
		saveBook(formattedBook).then(() => {
			dispatch(addBook(formattedBook));
			dispatch(hideLoading());
		});
	};
}

/* Get books */
export function handleInitialData() {
	return (dispatch) => {
		dispatch(showLoading());
		getBooks().then((books) => {
			dispatch(recieveBooks(books));
			dispatch(hideLoading());
		});
	};
}

/* update book comment */
export const handleBookComment = (id, comment) => {
	return (dispatch) => {
		dispatch(showLoading());
		updateComment(id, comment).then(() => {
			dispatch(updateBookComment(id, comment));
			dispatch(hideLoading());
		});
	};
};
