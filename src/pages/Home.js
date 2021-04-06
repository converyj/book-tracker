import React, { Component, Fragment } from 'react';
import Header from './../components/Header';
import { connect } from 'react-redux';
import BookList from '../components/BookList';
import { filterByValue, sortByAuthor, sortByDate, handleInitialData } from '../actions/books';
import SearchBtn from '../components/SearchBtn';

class Home extends Component {
	componentDidMount() {
		this.props.handleInitialData().then(() => console.log('ready'));
	}

	/* handle the filtering of books */
	filterBooks = (e) => {
		const input = e.target.value;
		this.props.filterByValue(input);
	};

	/* handle the sorting of books based on author or date */
	handleSortedList = (e) => {
		let sortBy = e.target.value;
		if (sortBy === 'By Author') {
			this.props.sortByAuthor();
		}
		else if (sortBy === 'By Date') {
			this.props.sortByDate();
		}
	};

	render() {
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
