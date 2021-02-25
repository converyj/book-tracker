import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import DisplayRating from './DisplayRating';
import './book.css';
import { formatDate } from './../utils/helper';
import CommentField from './CommentField';

/**
 * @description Displays a book and the user's own rating 
 */
const Book = ({ book }) => {
	const [
		showComment,
		setShowComment
	] = useState(false);

	const handleShowComment = (show = !showComment) => {
		setShowComment(show);
	};
	console.log(showComment);
	return (
		<li>
			<div className="book">
				<div className="book-top">
					<div
						className="book-cover"
						style={{
							width: 128,
							height: 193,
							backgroundImage: `url(${book.image ? book.image : ''})`
						}}
					/>
				</div>

				<div className="book-title">{book.title}</div>
				<div className="book-authors">
					{book.authors ? book.authors.join(',') : 'No Author'}
				</div>
				<DisplayRating book={book} />
				<div className="book-info">
					<div className="date-read">
						Read on <strong>{formatDate(book.date)}</strong>
					</div>
					<input
						type="checkbox"
						name="isLibraryBook"
						value={book.isLibraryBook}
						checked={book.isLibraryBook}
						readOnly
					/>
					<label id="isLibraryBook">Library Book</label>
					<div className="form-group" onClick={handleShowComment}>
						Comment {showComment ? <ExpandLess /> : <ExpandMore />}
					</div>
					{showComment && (
						<CommentField
							comment={book.comment}
							id={book.id}
							show={handleShowComment}
						/>
					)}
				</div>
			</div>
		</li>
	);
};

Book.propTypes = {
	book: PropTypes.object.isRequired
};

export default Book;
