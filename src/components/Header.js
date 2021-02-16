import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filterByValue } from '../actions/books';
import './header.css';

export class Header extends Component {
	state = {
		query: '',
		sortOptions: [
			'By Author',
			'By Date'
		]
	};

	render() {
		return (
			<header>
				<input
					type="text"
					placeholder="Search By Title or Author"
					aria-label="Search"
					onChange={(e) => this.props.filterBooks(e)}
				/>
				<select name="sort" id="" onChange={(e) => this.props.handleSortedList(e)}>
					{this.state.sortOptions.map((opt, i) => <option key={i}>{opt}</option>)}
				</select>
			</header>
		);
	}
}

export default Header;
