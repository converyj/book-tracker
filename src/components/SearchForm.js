import React, { Component } from 'react';
import Dropdown from './Dropdown';
import './searchForm.css';
import { handleAddBook } from './../actions/books';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AddRating from './AddRating';
import DatePicker from './DatePicker';
import { withRouter } from 'react-router-dom';

/**
 * @description Save input field state and add book 
 */
class SearchForm extends Component {
	state = {
		book: {},
		title: '',
		date: '',
		comment: '',
		rate: 0,
		isLibraryBook: false,
		showDropdown: false
	};

	setDate = (date) => {
		this.setState({
			date
		});
	};

	/* real check is to show the dropdown to display list of books when title changes and still showing the dropdown (keeps it from not updated at every render)
	- need it to make the Dropdown Component render the first time  
	   - this.state.showDropdown will always be true after first time showing the dropdown which is responsibe for displaying the dropdown 
	   - prevProps.showDropdown will only be false at first update which will cause componentDidUpdate not to run */
	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.title !== prevState.title &&
			this.state.showDropdown === prevState.showDropdown
		) {
			console.log('updated');
			this.setState({ showDropdown: true });
		}

		// redirect if finished adding book to state
		if (prevProps.loading.default !== 0) {
			this.props.history.push('/');
		}
	}

	toggleLibraryBook = () => {
		this.setState({ isLibraryBook: !this.state.isLibraryBook });
	};

	/* set the title and book when user has clicked on a book from the dropdown */
	handleTitle = (book) => {
		const { title } = book.volumeInfo;
		this.setState({ title, book, showDropdown: false });
	};

	/* add book */
	handleAdd = () => {
		console.log(this.props);
		const { book, date, comment, isLibraryBook, rate } = this.state;
		this.props.handleAddBook({ ...book, date, comment, isLibraryBook, rate });
	};

	/* set the rate of book when user clicks on star */
	setRate = (value) => {
		this.setState({ rate: value });
	};

	handleInputChange = (e) => {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		console.log(value, name);
		this.setState({ [name]: value });
	};

	render() {
		const { title, comment, isLibraryBook, rate, showDropdown } = this.state;
		return (
			<div className="search-grid">
				<form action="">
					<div className="form-title">
						<div className="form-group">
							<label htmlFor="book-title">Book Title:</label>
							<input
								type="text"
								id="book-title"
								name="title"
								value={title}
								onChange={this.handleInputChange}
							/>
						</div>
						{/* show dropdown if title value is not empty and user has not chosen a book */}
						{showDropdown &&
						title.length > 0 && <Dropdown query={title} setTitle={this.handleTitle} />}
					</div>

					<DatePicker handleDate={this.setDate} />
					<div className="form-group">
						<label htmlFor="isLibraryBook">Library Book</label>
						<input
							type="checkbox"
							id="isLibraryBook"
							name="isLibraryBook"
							value={isLibraryBook}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="comment">Comment</label>
						<textarea
							name="comment"
							id="comment"
							value={comment}
							onChange={this.handleInputChange}
						/>
					</div>
					<div className="form-group">
						<AddRating setRate={this.setRate} rate={rate} />
					</div>
				</form>
				<a className="btn btn--form" type="button" onClick={this.handleAdd}>
					ADD
				</a>
			</div>
		);
	}
}

export default withRouter(
	connect(
		({ loadingBar }) => {
			return {
				loading: loadingBar
			};
		},
		{ handleAddBook }
	)(SearchForm)
);
