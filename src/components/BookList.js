import React, { Component } from 'react';
import { recieveBooks } from './../actions/books';
import { connect } from 'react-redux';
import Book from './../components/Book';
import './bookList.css';

class BookList extends Component {
	render() {
		console.log(this.props.filteredBooks);
		return (
			<div className="books-grid">
				{this.props.filteredBooks ? (
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