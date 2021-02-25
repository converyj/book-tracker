import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './commentField.css';
import { connect } from 'react-redux';
import { updateBookComment } from '../actions/books';

class CommentField extends Component {
	state = {
		comment: this.props.comment
	};

	render() {
		const { id, updateBookComment, show } = this.props;
		const { comment } = this.state;

		return (
			<div>
				<textarea
					name="comment"
					value={comment}
					id=""
					onChange={(e) => this.setState({ comment: e.target.value })}
					className="comment-field">
					{comment}
				</textarea>
				<button
					className="btnSmall"
					onClick={() => updateBookComment(id, comment)}
					show={false}>
					Update
				</button>
			</div>
		);
	}
}

CommentField.propTypes = {};

export default connect(null, { updateBookComment })(CommentField);
