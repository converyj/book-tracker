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
		// if changed page and there is filters, refresh the books to apply the filter
		if (
			prevProps.books.currentPage !== this.props.books.currentPage &&
			this.props.books.appliedFilters.length > 0
		) {
			console.log('filter');
			const filters = this.props.books.appliedFilters;
			filters.forEach((filter) => {
				switch (filter) {
					case 'SORT_BY_DATE':
						this.props.sortByDate();
						break;

					case 'SORT_BY_AUTHOR':
						this.props.sortByAuthor();
						break;

					case 'FILTER_BY_VALUE':
						this.props.filterByValue();
						break;
					default:
						break;
				}
			});
		}
		// filter by value was applied but is not empty and there are still filters, refresh the book list to apply the filter
		console.log(prevProps.books.appliedFilters);
		// if (
		// 	prevProps.books.appliedFilters !== this.props.books.appliedFilters &&
		// 	this.props.books.appliedFilters.length > 0
		// ) {
		// 	console.log('filter gone');
		// 	let flag = false;
		// 	const filter = this.props.books.appliedFilters[0];
		// 	console.log(filter);
		// 	switch (filter) {
		// 		case 'SORT_BY_DATE':
		// 			this.props.sortByDate();
		// 			break;

		// 		case 'SORT_BY_AUTHOR':
		// 			this.props.sortByAuthor();
		// 			flag = true;
		// 			break;
		// 		default:
		// 			break;
		// 	}
		// 	flag = false;
		// }
	}

	render() {
		const { filteredBooks, filteredPages } = this.props.books;
		console.log(filteredBooks);
		return (
			<Fragment>
				{filteredPages > 0 && <Pagination />}
				<div className="books-grid">
					{filteredBooks && filteredBooks.length > 0 ? (
						filteredBooks.map((book) => <Book key={book.id} book={book} />)
					) : (
						<h1>No Books</h1>
					)}
				</div>
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
