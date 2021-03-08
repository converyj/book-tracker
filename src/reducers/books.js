import {
	RECIEVE_BOOKS,
	LOAD_NEW_PAGE,
	LOAD_EXACT_PAGE,
	FILTER_BY_VALUE,
	SORT_BY_AUTHOR,
	SORT_BY_DATE,
	ADD_BOOK,
	UPDATE_COMMENT
} from '../actions/books';

export default function books(state = {}, action) {
	switch (action.type) {
		case RECIEVE_BOOKS:
			let totalBooks = Object.values(action.books).length;
			const { books } = action;
			let countPerPage = action.countPerPage || 20;

			// Need the total number of pages. This is used in rendering the pagination component: round up pages
			let totalPages = Math.ceil(totalBooks / countPerPage);
			// only load 20 books to start with
			// set books as array, not as an object
			let allBooks = Object.values(books);
			let filteredBooks = allBooks.slice(0, countPerPage);

			return {
				...state,
				// all books unfiltered
				books: allBooks,
				filteredBooks: filteredBooks,
				// currentCount is the 'upper count': current number of books seen so far. This changes throughout the app
				currentCount: countPerPage,
				countPerPage,
				totalCount: totalBooks,
				currentPage: 1,
				// the total number of pages without any filters applied
				totalPages,
				// the total number of pages after a filter has been applied
				filteredPages: totalPages
			};

		case LOAD_NEW_PAGE:
			// clone the state
			let loadNewPageState = { ...state };
			console.log(loadNewPageState);
			// how many pages should be added. Will always be 1 or -1
			let addPages = action.payload.page;
			// add it to the current page
			loadNewPageState.currentPage += addPages;

			let perPage = loadNewPageState.countPerPage; // 20 by default

			let nextBooks;
			// next page
			if (addPages === 1) {
				/*
				1. Increase the current books shown 
				- moving from page 1 to 2 will cause 'upperCount' to be 40
				*/
				let upperCount = loadNewPageState.currentCount + perPage;
				// get the previous number of books shown: will be 20 (page 2)
				let lowerCount = loadNewPageState.currentCount;
				console.log(lowerCount, upperCount);
				/* 2. Update the current number of books shown 
				- change the currentCount to match the 'upperCount'. It'll be used as such at any point after this line
				*/

				loadNewPageState.currentCount += loadNewPageState.countPerPage;

				// 3. retrieve next books eg. within the range of 20-40 (for page 2)
				console.log(loadNewPageState.books);
				nextBooks = loadNewPageState.books.slice(lowerCount, upperCount);
			}
			// previous page
			if (addPages === -1) {
				/*
				1. Decrease the number of books showm
				- 'currentCount' has changed roles: now it serves as the upperCount - will be 40 (page 2)
				*/
				let upperCount = loadNewPageState.currentCount;
				// get the previous number of books shown - will be 20 (page 2)
				let lowerCount = loadNewPageState.currentCount - perPage; // decrease by 20

				/* 2. Update the current number of books shown 
				- change the currentCount to match the 'lowerCount'. It'll be used as such at any point after this line
				*/
				loadNewPageState.currentCount = lowerCount;

				// 3. retrieve next books eg. within the range of 0-20 (for page 2)
				nextBooks = loadNewPageState.books.slice(
					lowerCount - perPage,
					upperCount - perPage
				);
			}

			// update filterdBooks
			loadNewPageState.filteredBooks = nextBooks;
			return loadNewPageState;

		case LOAD_EXACT_PAGE:
			const exactPageState = { ...state };
			console.log(exactPageState);
			// the page number
			const exactPage = action.payload.page;
			console.log(exactPage);
			// 1. get the number of books seen so far eg 20 * 2 = 40 books
			let upperCountExact = exactPageState.countPerPage * exactPage;
			console.log(upperCountExact);
			// get the previous number of books shown
			let lowerCountExact = upperCountExact - exactPageState.countPerPage;
			console.log(lowerCountExact);

			// 2. retrieve next books eg. within the 40-60 range (page 3)
			let exactBooks = exactPageState.books.slice(lowerCountExact, upperCountExact);
			console.log(exactBooks);
			// update filtered books
			exactPageState.filteredBooks = exactBooks;
			// update the current books shown and current page
			exactPageState.currentCount = upperCountExact;
			exactPageState.currentPage = exactPage;

			return exactPageState;
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
			let sortByDate = state.filteredBooks.sort((a, b) => a.date - b.date);

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
