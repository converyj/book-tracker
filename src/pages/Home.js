import React, { Component, Fragment } from 'react';
import Header from './../components/Header';
import { connect } from 'react-redux';
import { getBooksLS } from '../utils/api';
import BookList from '../components/BookList';
import {
	recieveBooks,
	filterByValue,
	sortByAuthor,
	sortByDate,
	handleInitialData
} from '../actions/books';
import SearchBtn from '../components/SearchBtn';

class Home extends Component {
	componentWillMount() {
		console.log('Home mounted');
		this.props.handleInitialData();
	}

	/* handle the filtering of books */
	filterBooks = (e) => {
		const input = e.target.value;
		this.props.filterByValue(input);
	};

	/* handle the sorting of books based on author or date */
	handleSortedList = (e) => {
		let sortBy = e.target.value;
		console.log(sortBy);
		if (sortBy === 'By Author') {
			console.log('author');
			this.props.sortByAuthor();
		}
		else {
			console.log('ele');
			this.props.sortByDate();
		}
	};

	render() {
		console.log('Home render');
		return (
			<div>
				<Header
					filterBooks={(e) => this.filterBooks(e)}
					handleSortedList={(e) => this.handleSortedList(e)}
				/>

				{this.props.loading.default == 1 ? (
					<div className="books-grid">
						<h1>Loading</h1>
					</div>
				) : (
					<Fragment>
						<BookList />
						<SearchBtn />
					</Fragment>
				)}
			</div>
		);
	}
}

export default connect(
	({ loadingBar }) => {
		return {
			loading: loadingBar
		};
	},
	{
		handleInitialData,
		filterByValue,
		sortByAuthor,
		sortByDate
	}
)(Home);
