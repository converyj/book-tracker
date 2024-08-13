import React, { Component, Fragment } from 'react';
import { sortByDate, sortByAuthor, filterByValue, recieveBooks } from './../actions/books';
import { getDatabase, ref, remove, get, query, orderByKey, startAt, limitToFirst } from "firebase/database";
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';
import { exportBooks, formatImportBook } from '../utils/helper';
import * as XLSX from 'xlsx';
import { getBookByVolume, saveBook } from '../utils/api';
/**
 * @description Display list of books user has read 
 */
export class BookList extends Component {
    state = {
        data: [],
        isLoading: false
    }

    componentDidUpdate(prevProps, _) {
        // if filter by value was applied but is now not applied and there are still filters, refresh the book list to apply the filter
        if (
            prevProps.books.appliedFilters.includes('FILTER_BY_VALUE') &&
            !this.props.books.appliedFilters.includes('FILTER_BY_VALUE') &&
            this.props.books.appliedFilters.length > 0
        ) {
            const filter = this.props.books.appliedFilters[0];
            switch (filter) {
                case 'SORT_BY_DATE':
                    this.props.sortByDate();
                    break;

                case 'SORT_BY_AUTHOR':
                    this.props.sortByAuthor();
                    break;
                default:
                    break;
            }
        }
    }

    // handle the file upload and processing
    handleFileUpload = (e) => {

        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet);


            try {
                this.setState({ isLoading: true })
                // Delete the existing collection of books
                await this.deleteCollection(localStorage.userID);

                // Get formatted books with delay between requests
                const books = await this.getFormattedBooks(sheetData);

                // Pass the books to props
                this.props.recieveBooks(books);

                // Save each book
                for (const book of books) {
                    await saveBook(book);
                }
                console.log('after save');
                this.setState({ isLoading: false })
            } catch (error) {
                console.error('Error processing books:', error);
                alert('Error importing books. Please try again.');
                this.setState({ isLoading: false })
            }
        };

        reader.readAsBinaryString(file);
    };

    getFormattedBooks = async (data) => {
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        let books = [];

        for (const book of data) {
            try {
                console.log(book.Id);
                const googleBook = await getBookByVolume(book.Id, book.Title);
                const { smallThumbnail: image } = googleBook.volumeInfo.imageLinks;
                const { previewLink: link } = googleBook.volumeInfo;
                const formattedBook = formatImportBook({
                    ...book,
                    link,
                    image,
                });
                books.push(formattedBook);
            } catch (err) {
                console.error('Error fetching book:', err);
                throw new Error('Failed to fetch books. Please try again.')
            }

            // Apply a delay between requests to avoid too many requests error 
            await delay(2000); // Adjust the delay as needed (1000 ms = 1 second)
        }

        return books;
    };

    deleteCollection = async (userID, batchSize = 10) => {
        try {
            const db = getDatabase()

            // Create a reference to the books collection for the specified user
            const booksRef = ref(db, `users/${userID}/books/`);

            // Function to delete a batch of books
            const deleteBatch = async (books) => {
                const deletePromises = books.map(book => {
                    const bookRef = ref(db, `users/${userID}/books/${book.key}`);
                    return remove(bookRef);
                });

                await Promise.all(deletePromises);
            };

            let hasMore = true;
            let lastKey = null;

            while (hasMore) {
                // Fetch a batch of books eg. 11 - one more than batch size to check if there are more than 10 books left 
                const booksQuery = lastKey
                    ? query(booksRef, orderByKey(), startAt(lastKey), limitToFirst(batchSize + 1))
                    : query(booksRef, limitToFirst(batchSize + 1));

                const snapshot = await get(booksQuery);

                if (snapshot.exists()) {
                    const books = snapshot.val();
                    const bookKeys = Object.keys(books);

                    // Check if we fetched more than the batch size
                    if (bookKeys.length > batchSize) {
                        // Remove the extra key to fetch the next batch in the next iteration
                        lastKey = bookKeys.pop();
                    } else {
                        hasMore = false;
                    }

                    // Delete the batch of books
                    await deleteBatch(bookKeys.map(key => ({ key })));
                } else {
                    // No more books to delete
                    hasMore = false;
                }
            }

            console.log(`All books for user '${userID}' have been deleted.`);
        } catch (error) {
            console.error('Error deleting books in batches:', error);
            throw new Error('Failed to delete books in batches. Please try again later.');
        }
    };

    render() {
        const { books, filteredBooks, filteredPages } = this.props.books;
        const { isLoading } = this.state;
        return (
            <Fragment>
                {isLoading ? (
                    <div className="books-grid">
                        <div className="flex flex-col items-center">
                            <h1>Importing Books</h1>
                            <p>This may take a while</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex">
                            <button
                                style={{ margin: '0px' }}
                                className="btn btn"
                                onClick={() => exportBooks(books)}>
                                Export Books
                            </button>
                            <div id='import-books'>
                                <p className='label'>Import Books</p>
                                <input type="file" accept=".xlsx" onChange={this.handleFileUpload} />
                            </div>
                        </div>
                        {filteredPages > 0 && <Pagination />}
                        <div className="books-grid">
                            {filteredBooks && filteredBooks !== null && filteredBooks.length > 0 ? (
                                filteredBooks.map((book, index) => (
                                    <Book key={index} book={book} id={book.id} />
                                ))
                            ) : (
                                <h1>No Books</h1>
                            )}
                        </div>
                        {filteredPages > 0 && <Pagination />}
                    </>
                )}
            </Fragment>
        );
    }
}

export default connect(
    ({ books, loadingBar }) => {
        return {
            books,
            loading: loadingBar
        };
    },
    { sortByAuthor, sortByDate, filterByValue, recieveBooks }
)(BookList);
