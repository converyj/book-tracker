import React, { Component } from 'react';
import Header from './../components/Header';
import { connect } from 'react-redux';
import { getBooksLS } from '../utils/api';
import BookList from '../components/BookList';
import { recieveBooks, filterByValue, sortByAuthor, sortByDate } from '../actions/books';
import SearchBtn from '../components/SearchBtn';

class Home extends Component {
	componentWillMount() {
		console.log('Home mounted');
		const books = getBooksLS();
		this.props.recieveBooks(books);
	}

	filterBooks = (e) => {
		const input = e.target.value;
		this.props.filterByValue(input);
	};

	handleSortedList = (e) => {
		let sortBy = e.target.value;
		if (sortBy === 'By Author') {
			this.props.sortByAuthor();
		}
		else {
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
				<BookList />
				<SearchBtn />
			</div>
		);
	}
}

export default connect(null, { recieveBooks, filterByValue, sortByAuthor, sortByDate })(Home);
