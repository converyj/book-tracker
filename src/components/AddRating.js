import React from 'react';
import PropTypes from 'prop-types';

import Star from './Star';

/**
 * @description Displays the rating number from the Search Form Component state 
 */
const AddRating = ({ setRate, rate }) => {
	return (
		<div>
			<span>Your Rating:</span>
			<Star value={rate ? rate : 0} onClick={setRate} />
		</div>
	);
};

AddRating.propTypes = {
	rate: PropTypes.number.isRequired,
	setRate: PropTypes.func.isRequired
};

export default AddRating;
