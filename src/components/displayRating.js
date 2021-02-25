import React from 'react';
import PropTypes from 'prop-types';

import Star from './Star';

/**
 * @description Displays the rating number from the book object
 */
const DisplayRating = ({ book }) => {
	const { rate } = book;
	return (
		<div>
			<span>Your Rating:</span>
			<Star value={rate} />
		</div>
	);
};

DisplayRating.propTypes = {
	book: PropTypes.object.isRequired
};

export default DisplayRating;
