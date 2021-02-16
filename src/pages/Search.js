import React, { Component } from 'react';
import { searchBook } from '../utils/api';
// import DatePickers from './../components/DatePickers';
import Dropdown from './../components/Dropdown';

export default class Search extends Component {
	state = {
		title: '',
		date: '',
		comment: '',
		isLibraryBook: false,
		books: {}
	};
	setDate = (date) => {
		this.setState({
			date
		});
	};

	// componentDidUpdate() {
	// 	if (state.title !== prevState.title) {
	// 		<Dropdown
	// 	}
	// }

	setTitle = (title) => {
		let query = title;
		this.setState({
			title
		});
		searchBook(query).then((books) => {
			this.setState({ books });
		});
	};

	render() {
		const { title, comment, isLibraryBook, books } = this.state;
		return (
			<div className="search-grid">
				<form action="">
					<label htmlFor="book-title">Book Title:</label>
					<input
						type="text"
						id="book-title"
						value={title}
						onChange={(e) => this.setTitle(e.target.value)}
					/>
					{books && books.length > 0 && <Dropdown books={this.state.books} />}
					{/* <DatePickers handleDateChange={(date) => this.setDate(date)} /> */}

					<label for="comment">Comment:</label>
					<textarea
						id="comment"
						name="comment"
						value={comment}
						onChange={(e) => this.setState({ comment: e.target.value })}
					/>

					<label for="isLibraryBook">Library Book</label>
					<input
						type="checkbox"
						id="isLibraryBook"
						name="isLibraryBook"
						value={isLibraryBook}
						onChange={(e) => this.setState({ isLibraryBook: e.target.value })}
					/>
				</form>
			</div>
		);
	}
}
