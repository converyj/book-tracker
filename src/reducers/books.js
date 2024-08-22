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
import {
    addFilterIfNotExist,
    removeFilterIfExist,
    checkNextBooksBasedOnFilters
} from '../utils/helper';
import cloneDeep from 'lodash-es/cloneDeep.js';

export default function books(state = {}, action) {
    let booksToSort;

    switch (action.type) {
        case RECIEVE_BOOKS:
            if (action.books === null) {
                action.books = [];
            }
            const { books } = action;
            let totalBooks = Object.values(action.books).length;
            let countPerPage = action.countPerPage || 20;

            // total number of pages. This is used in rendering the pagination component: round up pages
            let totalPages = Math.ceil(totalBooks / countPerPage);
            // only load 20 books to start with
            // set books as array, not as an object
            let allBooks = Object.values(books);
            let filteredBooks = allBooks.slice(0, countPerPage);

            return {
                ...state,
                // all books unfiltered
                books: allBooks,
                // books per page from count per page and filters applied
                filteredBooks: filteredBooks,
                // currentCount is the 'upper count': current number of books seen so far. This changes throughout the app
                currentCount: countPerPage,
                countPerPage,
                // total number of books unfiltered
                totalCount: totalBooks,
                currentPage: 1,
                // the total number of pages without any filters applied
                totalPages,
                // the total number of pages after a filter has been applied
                filteredPages: totalPages,
                // active filters
                appliedFilters: []
            };

        case LOAD_NEW_PAGE:
            // clone the state
            let loadNewPageState = cloneDeep(state);
            // how many pages should be added. Will always be 1 or -1
            let addPages = action.payload.page;
            // add it to the current page
            loadNewPageState.currentPage += addPages;

            let perPage = loadNewPageState.countPerPage; // 20 by default

            let nextBooks;
            let slicedBooks;
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
                // the number of books depends on if there are filters applied --> FILTER_BY_VALUE filter reduces the number of books
                // if no filter --> use 'books' array rather than 'filteredBooks' because using 'filterBooks' would result in an empty array since we only have 20 books there when the page first loads
                slicedBooks = checkNextBooksBasedOnFilters(loadNewPageState);
                nextBooks = slicedBooks.slice(lowerCount, upperCount);
            }
            // previous page
            if (addPages === -1) {
                /*
                1. Decrease the number of books shown
                - 'currentCount' has changed roles: now it serves as the upperCount - will be 40 (page 2)
                */
                let upperCount = loadNewPageState.currentCount;
                // get the previous number of books shown - will be 20 (page 2)
                let lowerCount = loadNewPageState.currentCount - perPage; // decrease by 20

                /* 2. Update the current number of books shown 
                - change the currentCount to match the 'lowerCount'. It'll be used as such at any point after this line
                */
                loadNewPageState.currentCount = lowerCount;

                // 3. retrieve next books eg. within the range of 0-20 (starting at page 2)
                // the number of books depends on if there are filters applied --> FILTER_BY_VALUE filter reduces the number of books
                // if no filter --> use 'books' array rather than 'filteredBooks' because using 'filterBooks' would result in an empty array since we only have 20 books there when the page first loads
                slicedBooks = checkNextBooksBasedOnFilters(loadNewPageState);
                nextBooks = slicedBooks.slice(lowerCount - perPage, upperCount - perPage);
            }

            // update filterdBooks and filteredCount
            loadNewPageState.filteredBooks = nextBooks;
            loadNewPageState.filteredCount = loadNewPageState.filteredBooks.length;
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
            // // the number of books depends on if there are filters applied --> FILTER_BY_VALUE filter reduces the number of books
            const slicedExactBooks = checkNextBooksBasedOnFilters(exactPageState);
            let exactBooks = slicedExactBooks.slice(lowerCountExact, upperCountExact);
            // update filtered books
            exactPageState.filteredBooks = exactBooks;
            exactPageState.filteredCount = exactPageState.filteredBooks.length;
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
            let newState = cloneDeep(state);
            //if the value from the input box is not empty
            if (value) {
                const filteredValues = newState.books.filter((book) => {
                    return book.title.toLowerCase().includes(value.toLowerCase());
                });
                // add the sortByValue filter if doesn't exist
                newState.appliedFilters = addFilterIfNotExist(
                    FILTER_BY_VALUE,
                    newState.appliedFilters
                );

                // new property of total number of books that match filter; need this so BookList Component would not show all the books at once; will be the same as filterBooks if the number of books are less than the count of books per page
                newState.matchedBooks = filteredValues;


                // if books that match the filter value is more than the count of books per page, then only show the count of books per page; else show all of the books
                if (filteredValues.length > newState.countPerPage) {
                    // 1. get the number of books seen so far eg 20 * 2 = 40 books
                    let filterByValueUpperCount = newState.countPerPage * newState.currentPage;
                    // get the previous number of books shown
                    let filterByValueLowerCount = filterByValueUpperCount - newState.countPerPage;

                    booksToSort = checkNextBooksBasedOnFilters(newState)
                    newState.filteredBooks = booksToSort.slice(filterByValueLowerCount, filterByValueUpperCount);
                }
                else {
                    newState.filteredBooks = filteredValues;
                }

                // update number of books with total number of matched books
                newState.filteredCount = newState.filteredBooks.length;

                // update number of filtered pages
                newState.filteredPages = Math.ceil(
                    newState.matchedBooks.length / newState.countPerPage
                );
            }
            else {
                //if the value is empty, we can assume everything has been erased
                //in that case, remove the current filter
                newState.appliedFilters = removeFilterIfExist(
                    FILTER_BY_VALUE,
                    newState.appliedFilters
                );

                // set the state back
                // 1. get the number of books seen so far eg 20 * 2 = 40 books
                let upperCount = newState.countPerPage * newState.currentPage;
                // get the previous number of books shown
                let lowerCount = upperCount - newState.countPerPage;

                newState.filteredBooks = newState.books.slice(lowerCount, upperCount);
                newState.filteredCount = newState.filteredBooks.length;
                newState.filteredPages = newState.totalPages;
            }

            return newState;
        case SORT_BY_DATE:
            let newSortByDateState = cloneDeep(state);

            // sort on all books or filtered books
            booksToSort = checkNextBooksBasedOnFilters(newSortByDateState)
            const sortedByDateBooks = booksToSort.sort((a, b) => {
                return b.date > a.date ? 1 : a.date > b.date ? -1 : 0;
            });

            // remove the sortByAuthor filter
            newSortByDateState.appliedFilters = removeFilterIfExist(
                SORT_BY_AUTHOR,
                newSortByDateState.appliedFilters
            );

            newSortByDateState.appliedFilters = addFilterIfNotExist(
                SORT_BY_DATE,
                newSortByDateState.appliedFilters
            );

            // set the filtered books again with the sorted books

            // 1. get the number of books seen so far eg 20 * 2 = 40 books
            let sortedDateUpperCount = newSortByDateState.countPerPage * newSortByDateState.currentPage;
            // get the previous number of books shown
            let sortedDateLowerCount = sortedDateUpperCount - newSortByDateState.countPerPage;

            newSortByDateState.filteredBooks = sortedByDateBooks.slice(sortedDateLowerCount, sortedDateUpperCount);

            return newSortByDateState;
        case SORT_BY_AUTHOR:
            let newSortByAuthorState = cloneDeep(state);

            // sort on all books or filtered books
            booksToSort = checkNextBooksBasedOnFilters(newSortByAuthorState)
            const sortedByAuthorBooks = booksToSort.sort((a, b) => {
                return a.authors - b.authors ? 1 : b.authors > a.authors ? -1 : 0;
            });

            // remove the sortByDate filter
            newSortByAuthorState.appliedFilters = removeFilterIfExist(
                SORT_BY_DATE,
                newSortByAuthorState.appliedFilters
            );

            newSortByAuthorState.appliedFilters = addFilterIfNotExist(
                SORT_BY_AUTHOR,
                newSortByAuthorState.appliedFilters
            );

            // set the filtered books again with the sorted books

            // 1. get the number of books seen so far eg 20 * 2 = 40 books
            let sortedAuthorUpperCount = newSortByAuthorState.countPerPage * newSortByAuthorState.currentPage;
            // get the previous number of books shown eg. 20
            let sortedAuthorLowerCount = sortedAuthorUpperCount - newSortByAuthorState.countPerPage;

            newSortByAuthorState.filteredBooks = sortedByAuthorBooks.slice(sortedAuthorLowerCount, sortedAuthorUpperCount);

            return newSortByAuthorState;

        case UPDATE_COMMENT:
            let newUpdatedBooks = cloneDeep(state);

            const updatedBooks = state.books.map((book) => {
                if (book.id == action.id) {
                    return { ...book, comment: action.comment };
                }
                return book;
            });
            newUpdatedBooks.books = updatedBooks;

            // set the filtered books again with the sorted books

            // 1. get the number of books seen so far eg 20 * 2 = 40 books
            let upperCount = newUpdatedBooks.countPerPage * newUpdatedBooks.currentPage;
            // get the previous number of books shown eg. 20
            let lowerCount = upperCount - newUpdatedBooks.countPerPage;

            newUpdatedBooks.filteredBooks = updatedBooks.slice(lowerCount, upperCount);

            return newUpdatedBooks;

        default:
            return state;
    }
}
