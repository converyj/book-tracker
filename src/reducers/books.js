import {
	RECIEVE_BOOKS,
	FILTER_BY_VALUE,
	SORT_BY_AUTHOR,
	SORT_BY_DATE,
	ADD_BOOK,
	UPDATE_COMMENT
} from '../actions/books';

export default function books(state = {}, action) {
	switch (action.type) {
		case RECIEVE_BOOKS:
			let { books } = action;
			// set books as array, not as an object
			let bookValues = Object.values(books);

			return {
				...state,
				books: bookValues,
				filteredBooks: bookValues
			};
		case ADD_BOOK:
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
			let newState = { ...state };
			console.log(state, newState);

			if (value) {
				const filteredValues = state.books.filter((book) => {
					return book.title.toLowerCase().includes(value);
				});
				console.log(filteredValues);
				newState.filteredBooks = filteredValues;
				// let appliedFilters = state.appliedFilters;
				//if the value from the input box is not empty

				//check if the filter already exists in the tracking array
				// let index = appliedFilters.indexOf(FILTER_BY_VALUE);
				// if (index === -1)
				// 	//filter does not exist, add it to tracking array
				// 	appliedFilters.push(FILTER_BY_VALUE);
				//change the filtered books to reflect the change
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
			let sortByDate = state.filteredBooks.sort(
				(a, b) => Number(new Date(a.date)) - Number(new Date(b.date))
			);

			newSortByDateState.filteredBooks = sortByDate;

			return newSortByDateState;
		case SORT_BY_AUTHOR:
			console.log(state);
			let newSortByAuthorState = Object.assign({}, state);
			let sortByAuthor = state.filteredBooks.sort((a, b) => a.authors[0] - b.authors[0]);

			console.log(sortByAuthor);
			newSortByAuthorState.filteredBooks = sortByAuthor;

			return newSortByAuthorState;

		case UPDATE_COMMENT:
			let newUpdatedBooks = Object.assign({}, state);

			const updatedElements = state.books.map((book) => {
				if (book.id == action.id) {
					return { ...book, comment: action.comment };
				}
				return book;
			});
			newUpdatedBooks.books = updatedElements;
			newUpdatedBooks.filteredBooks = updatedElements;

			return newUpdatedBooks;

		default:
			return state;
	}
}
