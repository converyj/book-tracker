import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './commentField.css';
import { connect } from 'react-redux';
import { handleBookComment } from '../actions/books';

/**
 * @description Responsible for displaying the book comment and allowing user to update it 
 */

class CommentField extends Component {
	state = {
		comment: this.props.comment
	};

	componentDidMount() {
		this.commentField.focus();
	}

	render() {
		const { id, handleBookComment } = this.props;
		const { comment } = this.state;

		return (
			<div>
				<textarea
					name="comment"
					value={comment}
					id=""
					onChange={(e) => this.setState({ comment: e.target.value })}
					className="comment-field"
					ref={(input) => {
						this.commentField = input;
					}}>
					{comment}
				</textarea>
				<button className="btnSmall" onClick={() => handleBookComment(id, comment)}>
					Update
				</button>
			</div>
		);
	}
}

CommentField.propTypes = {
	id: PropTypes.string.isRequired
};

export default connect(null, { handleBookComment })(CommentField);
