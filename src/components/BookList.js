import React, { Component, Fragment } from 'react';
import { sortByAuthor, sortByDate, filterByValue } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';

/**
 * @description Display list of books user has read 
 */
class BookList extends Component {
	componentDidUpdate(prevProps, _) {
		console.log('booklist update');
		// if page is changed and there are filters, refresh the books to apply the filter - can only be one
		if (
			prevProps.books.currentPage !== this.props.books.currentPage &&
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
		// if filter by value was applied but is now not applied and there are still filters, refresh the book list to apply the filter - can only be one
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
		const { filteredBooks, filteredPages } = this.props.books;
		return (
			<Fragment>
				{filteredPages > 0 && <Pagination />}
				<div className="books-grid">
					{filteredBooks && filteredBooks !== null && filteredBooks.length > 0 ? (
						filteredBooks.map((book, index) => <Book key={index} book={book} />)
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
