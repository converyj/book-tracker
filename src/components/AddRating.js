import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Star from './Star';

/**
 * @description Add own ratings of book 
 */
class AddRating extends Component {
	/**
 * @description Displays the rating number from the Search Form Component state
 */

	render() {
		const { setRate, rate } = this.props;

		return (
			<React.Fragment>
				<div>
					<span>Your Rating:</span>
					<Star value={rate ? rate : 0} onClick={setRate} />
				</div>
			</React.Fragment>
		);
	}
}

AddRating.propTypes = {
	rate: PropTypes.string.isRequired,
	setRate: PropTypes.func.isRequired
};

export default AddRating;
