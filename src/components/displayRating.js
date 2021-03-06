import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Star from './Star';

/**
 * @description Display own ratings of books on shelves and allow them to add ratings (only for the 'read' shelf)
 * 
 * rating holds the value of the star (1-5) for re-rendering of the page
 */
class displayRating extends Component {
	state = {
		rating: 0
	};

	/**
 * @description Saves the rating number in Local Storage (persist data between reloads of the page) and updates state
 */
	setRate = (value) => {
		const bookId = this.props.book.id;
		const number = parseInt(value) + 1;
		localStorage.setItem(bookId, number);
		this.setState({ rating: localStorage.getItem(bookId) });
	};

	render() {
		const { book } = this.props;

		return (
			<React.Fragment>
				<div>
					<span>Your Rating:</span>
					<Star
						value={
							book && localStorage.getItem(book.id) ? (
								parseInt(localStorage.getItem(book.id))
							) : (
								0
							)
						}
					/>
				</div>
			</React.Fragment>
		);
	}
}

// AddRating.propTypes = {
// 	book: PropTypes.object.isRequired
// };

export default displayRating;
