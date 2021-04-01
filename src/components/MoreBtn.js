import React, { Component } from 'react';
import more from '../icons/more.png';
import { Link } from 'react-router-dom';
import './moreBtn.css';

/**
 * @description Holds the Search Button on the Home page to link to the Search page 
 */
class MoreBtn extends Component {
	state = {
		action: ''
	};

	handleAction = (e, id) => {
		const action = e.target.value;
		console.log(action, id);
		this.props.deleteBook(id);
	};

	render() {
		const { id } = this.props;
		return (
			<div className="more-btn">
				<select onChange={(e) => this.handleAction(e, id)} defaultValue="action">
					<option value="action" disabled>
						Actions
					</option>
					<option value="delete">Delete Book</option>
				</select>
			</div>
		);
	}
}

export default MoreBtn;
