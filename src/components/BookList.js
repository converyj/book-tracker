import React, { Component, Fragment } from 'react';
import { sortByAuthor, sortByDate } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';

/**
 * @description Display list of books user has read 
 */
class BookList extends Component {
	componentDidUpdate(prevProps, prevState) {
		console.log(
			'book list updated',
			'prev',
			prevProps.books.currentPage,
			'cur',
			this.props.books.currentPage
		);
		// if changed page and there is filters, refresh the books to apply the filter
		if (
			prevProps.books.currentPage !== this.props.books.currentPage &&
			this.props.books.appliedFilters.length > 0
		) {
			console.log('filter');
			const filter = this.props.books.appliedFilters[0];
			switch (filter) {
				case 'SORT_BY_DATE':
					this.props.sortByDate();
					break;

				case 'SORT_BY_AUTHOR':
					this.props.sortByAuthor();
					break;
			}
		}
	}

	componentDidMount() {
		console.log('list mounted');
	}
	render() {
		const { filteredBooks } = this.props.books;
		console.log(filteredBooks);
		return (
			<Fragment>
				<Pagination />
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
	{ sortByAuthor, sortByDate }
)(BookList);
