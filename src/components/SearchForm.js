import React, { Component } from 'react';
// import DatePickers from './../components/DatePickers';
import Dropdown from './Dropdown';
import './searchForm.css';
import { addBook } from './../actions/books';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Star from './Star';
import AddRating from './AddRating';

class SearchForm extends Component {
	state = {
		book: {},
		title: '',
		date: '',
		comment: '',
		rate: '',
		isLibraryBook: false,
		showDropdown: false
	};
	setDate = (date) => {
		this.setState({
			date
		});
	};

	componentDidUpdate(_, prevState) {
		if (
			this.state.title !== prevState.title &&
			this.state.showDropdown === prevState.showDropdown
		) {
			console.log('updated');
			this.setState({ showDropdown: true });
		}
	}

	toggleLibraryBook = () => {
		this.setState({ isLibraryBook: !this.state.isLibraryBook });
	};

	handleTitle = (book) => {
		const { title } = book.volumeInfo;
		this.setState({ title, book, showDropdown: false });
	};

	handleAdd = () => {
		const { book, comment, isLibraryBook, rate } = this.state;
		this.props.addBook({ ...book, comment, isLibraryBook, rate });
	};

	setRate = (value) => {
		this.setState({ rate: value });
	};

	render() {
		const { title, comment, isLibraryBook, showDropdown } = this.state;
		return (
			<div className="search-grid">
				<form action="">
					<div className="form-title">
						<div className="form-group">
							<label htmlFor="book-title">Book Title:</label>
							<input
								type="text"
								id="book-title"
								value={title}
								onChange={(e) => this.setState({ title: e.target.value })}
							/>
						</div>

						{showDropdown && (
							<Dropdown query={this.state.title} setTitle={this.handleTitle} />
						)}
					</div>

					{/* <DatePickers handleDateChange={(date) => this.setDate(date)} /> */}
					<div className="form-group">
						<label htmlFor="comment">Comment:</label>
						<textarea
							id="comment"
							name="comment"
							value={comment}
							onChange={(e) => this.setState({ comment: e.target.value })}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="isLibraryBook">Library Book</label>
						<input
							type="checkbox"
							id="isLibraryBook"
							name="isLibraryBook"
							value={isLibraryBook}
							onChange={this.toggleLibraryBook}
						/>
					</div>
					<div className="form-group">
						<AddRating setRate={this.setRate} rate={this.state.rate} />
					</div>
				</form>
				<Link to="/" class="btn btn--form" type="button" onClick={this.handleAdd}>
					ADD
				</Link>
			</div>
		);
	}
}

export default connect(null, { addBook })(SearchForm);
