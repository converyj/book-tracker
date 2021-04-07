import React, { Component, useRef } from 'react';
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
	constructor(props) {
		super(props);
		this.state = {
			book: {},
			title: '',
			date: '',
			comment: '',
			rate: 0,
			isLibraryBook: false,
			showDropdown: false
		};

		// perserve the initial state in a new object
		this.baseState = this.state;
	}

	setDate = (date) => {
		this.setState({
			date
		});
	};

	/* real check is to show the dropdown to display list of books when title changes and still showing the dropdown (keeps it from not updated at every render)
	- need it to make the Dropdown Component render when title changes 
	   - this.state.showDropdown will always be true after first time showing the dropdown which is responsibe for displaying the dropdown 
	   - prevProps.showDropdown will only be false at first update which will cause componentDidUpdate not to run */
	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.title !== prevState.title &&
			this.state.showDropdown === prevState.showDropdown
		) {
			this.setState({ showDropdown: true });
		}

		// redirect if finished adding book to state
		console.log(prevProps.loading.default, this.props.loading.default);

		// if (prevProps.loading.default !== 0) {
		// 	console.log(prevProps.loading.default, this.props.loading.default);
		// 	this.props.history.push('/');
		// }
	}

	resetForm = () => {
		this.setState(this.baseState);
	};

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
		const { book, date, comment, isLibraryBook, rate } = this.state;
		this.props
			.handleAddBook({ ...book, date, comment, isLibraryBook, rate })
			.then(() => this.props.history.push('/'))
			.catch(() => {
				alert('Cannot add book. Book already in your list. Try adding a different book.');
				this.resetForm();
			});
	};

	/* set the rate of book when user clicks on star */
	setRate = (value) => {
		this.setState({ rate: value });
	};

	handleInputChange = (e) => {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		this.setState({ [name]: value });
	};

	render() {
		const { title, comment, isLibraryBook, rate, showDropdown } = this.state;
		return (
			<div className="search-grid">
				<Link to="/" className="btn btn--form" type="button">
					Go Back
				</Link>
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
