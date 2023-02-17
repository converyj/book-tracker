import React, { Component, Fragment } from 'react';
import { sortByDate, sortByAuthor, filterByValue } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';
import { exportBooks } from '../utils/helper';

/**
 * @description Display list of books user has read 
 */
class BookList extends Component {
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

    render() {
        const { books, filteredBooks, filteredPages } = this.props.books;
        return (
            <Fragment>
                <button
                    style={{ margin: '0px' }}
                    className="btn btn"
                    onClick={() => exportBooks(books)}>
                    Export Books
                </button>
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
    { sortByAuthor, sortByDate, filterByValue }
)(BookList);
