import React, { Component, Fragment } from 'react';
import { recieveBooks } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';
import Pagination from './Pagination';

/**
 * @description Display list of books user has read 
 */
class BookList extends Component {
	componentDidUpdate() {
		console.log('updated List');
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
	{ recieveBooks }
)(BookList);
