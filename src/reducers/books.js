import { RECIEVE_BOOKS, SORT_BY_AUTHOR } from '../actions/books';
import { FILTER_BY_VALUE, SORT_BY_DATE, ADD_BOOK } from './../actions/books';

export default function books(state = {}, action) {
	switch (action.type) {
		case RECIEVE_BOOKS:
			const { books } = action;
			return {
				...state,
				books,
				filteredBooks: books
			};
		case ADD_BOOK:
			// let allBooksState = Object.assign({}, state.books, { ...action.book });
			// const allBooks = { ...state.books, ...action.book };

			// // allBooksState.books = allBooks;
			// // allBooksState.filteredBooks = { ...state.filteredBooks, ...allBooks };
			// // console.log(allBooksState);
			return {
				...state,
				books: [
					...state.books,
					action.book
				],
				filteredBooks: [
					...state.filteredBooks,
					action.book
				]
			};
		case FILTER_BY_VALUE:
			const { value } = action;
			// clone the state - do not motify initial state
			let newState = Object.assign({}, state);
			if (value) {
				const filteredValues = state.books.filter((book) => {
					return (
						book.title.toLowerCase().includes(value) ||
						book.author.toLowerCase().includes(value)
					);
				});
				// let appliedFilters = state.appliedFilters;
				//if the value from the input box is not empty

				//check if the filter already exists in the tracking array
				// let index = appliedFilters.indexOf(FILTER_BY_VALUE);
				// if (index === -1)
				// 	//filter does not exist, add it to tracking array
				// 	appliedFilters.push(FILTER_BY_VALUE);
				//change the filtered books to reflect the change
				newState.filteredBooks = filteredValues;
			}
			else {
				//if the value is empty, we can assume everything has been erased
				// let index = appliedFilters.indexOf(FILTER_BY_VALUE);
				//in that case, remove the current filter
				// appliedFilters.splice(index, 1);
				// if (appliedFilters.length === 0) {
				//if there are no filters applied, reset the books to normal
				newState.filteredBooks = newState.books;
			}

			return newState;
		case SORT_BY_DATE:
			let newSortByDateState = Object.assign({}, state);
			let sortByDate = state.filteredBooks.sort((a, b) => a.date - b.date);

			newSortByDateState.filteredBooks = sortByDate;

			return newSortByDateState;
		case SORT_BY_AUTHOR:
			let newSortByAuthorState = Object.assign({}, state);
			let sortByAuthor = [
				...state.filteredBooks
			].sort((a, b) => a.author - b.author);

			console.log(sortByAuthor);
			newSortByAuthorState.filteredBooks = sortByAuthor;

			return newSortByAuthorState;
		default:
			return state;
	}
}
