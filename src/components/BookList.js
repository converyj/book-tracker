import React, { Component } from 'react';
import { recieveBooks } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';

/**
 * @description Display list of books user has read 
 */
class BookList extends Component {
	render() {
		console.log(this.props.filteredBooks);
		return (
			<div className="books-grid">
				{this.props.filteredBooks.length > 0 ? (
					this.props.filteredBooks.map((book) => <Book key={book.id} book={book} />)
				) : (
					<h1>No Books</h1>
				)}
			</div>
		);
	}
}

export default connect(
	({ filteredBooks }) => {
		return {
			filteredBooks
		};
	},
	{ recieveBooks }
)(BookList);
