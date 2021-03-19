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
import { addFilterIfNotExist, removeFilterIfExist } from '../utils/helper';

export default function books(state = {}, action) {
	switch (action.type) {
		case RECIEVE_BOOKS:
			if (action.books === null) {
				action.books = [];
			}
			const { books } = action;
			let totalBooks = Object.values(action.books).length;
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
				filteredPages: totalPages,
				appliedFilters: []
			};

		case LOAD_NEW_PAGE:
			// clone the state
			let loadNewPageState = { ...state };
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
				/* 2. Update the current number of books shown 
				- change the currentCount to match the 'upperCount'. It'll be used as such at any point after this line
				*/
				loadNewPageState.currentCount += loadNewPageState.countPerPage;

				// 3. retrieve next books eg. within the range of 20-40 (for page 2)
				// use 'books' array rather than 'filteredBooks' because using 'filterBooks' would result in an empty array since we only have 20 books there when the page first loads
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
			// the page number
			const exactPage = action.payload.page;
			// 1. get the number of books seen so far eg 20 * 2 = 40 books
			let upperCountExact = exactPageState.countPerPage * exactPage;
			// get the previous number of books shown
			let lowerCountExact = upperCountExact - exactPageState.countPerPage;

			// 2. retrieve next books eg. within the 40-60 range (page 3)
			let exactBooks = exactPageState.books.slice(lowerCountExact, upperCountExact);
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
			let newState = Object.assign({}, state);
			//if the value from the input box is not empty
			if (value) {
				const filteredValues = state.books.filter((book) => {
					return book.title.toLowerCase().includes(value);
				});
				// add the sortByValue filter if doesn't exist
				newState.appliedFilters = addFilterIfNotExist(
					FILTER_BY_VALUE,
					newState.appliedFilters
				);

				newState.filteredBooks = filteredValues;

				// update number of pages with filtered books
				newState.filteredCount = newState.filteredBooks.length;
				newState.filteredPages = Math.ceil(newState.filteredCount / newState.countPerPage);
			}
			else {
				//if the value is empty, we can assume everything has been erased
				//in that case, remove the current filter
				newState.appliedFilters = removeFilterIfExist(
					FILTER_BY_VALUE,
					newState.appliedFilters
				);

				// set the state back
				newState.filteredBooks = newState.books.slice(
					newState.currentPage === 1 ? 0 : newState.countPerPage,
					newState.currentCount
				);
				newState.filteredCount = newState.filteredBooks.length;
				newState.filteredPages = newState.totalPages;
			}

			return newState;
		case SORT_BY_DATE:
			let newSortByDateState = Object.assign({}, state);

			// sort on all books and not just filtered books
			let sortByDate = newSortByDateState.books.sort((a, b) => {
				return b.date > a.date ? 1 : a.date > b.date ? -1 : 0;
			});

			// only show 20 books per page
			newSortByDateState.filteredBooks = sortByDate.slice(
				newSortByDateState.currentPage === 1 ? 0 : newSortByDateState.countPerPage,
				newSortByDateState.currentCount
			);
			// delete the sortByAuthor filter
			newSortByDateState.appliedFilters = removeFilterIfExist(
				SORT_BY_AUTHOR,
				newSortByDateState.appliedFilters
			);

			newSortByDateState.appliedFilters = addFilterIfNotExist(
				SORT_BY_DATE,
				newSortByDateState.appliedFilters
			);
			return newSortByDateState;
		case SORT_BY_AUTHOR:
			let newSortByAuthorState = Object.assign({}, state);
			// sort on all books and not just the filtered books
			let sortByAuthor = newSortByAuthorState.books.sort((a, b) => {
				return a.authors - b.authors ? 1 : b.authors > a.authors ? -1 : 0;
			});

			// only show 20 books per page
			newSortByAuthorState.filteredBooks = sortByAuthor.slice(
				newSortByAuthorState.currentPage === 1 ? 0 : newSortByAuthorState.countPerPage,
				newSortByAuthorState.currentCount
			);

			// delete the sortByDate filter
			newSortByAuthorState.appliedFilters = removeFilterIfExist(
				SORT_BY_DATE,
				newSortByAuthorState.appliedFilters
			);

			newSortByAuthorState.appliedFilters = addFilterIfNotExist(
				SORT_BY_AUTHOR,
				newSortByAuthorState.appliedFilters
			);

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
