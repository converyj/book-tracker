import React, { useState } from 'react';
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import DisplayRating from './DisplayRating';
import './book.css';
import { formatDate } from './../utils/helper';
import CommentField from './CommentField';

/**
 * @description Displays a book and the user's own rating 
 * This component uses recompose's pure High-Order Component to only render the book if their state or props change eg. updating book comment  
 */
const Book = pure(({ book }) => {
	// whether to show the comment field
	const [
		showComment,
		setShowComment
	] = useState(false);

	// toggle showing the comment field
	const handleShowComment = () => {
		setShowComment(!showComment);
	};

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

				<h4 className="book-title">{book.title}</h4>
				<p className="book-authors">
					{book.authors ? book.authors.join(', ') : 'No Author'}
				</p>
				<DisplayRating book={book} disabled={true} />
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
					<div className="form-group comment" onClick={handleShowComment}>
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
});

Book.propTypes = {
	book: PropTypes.object.isRequired
};

export default Book;
