import React from 'react';
import PropTypes from 'prop-types';

import AddRating from './AddRating';
import './book.css';

/**
 * @description Displays a book with an option to move book and display ratings (both own and average) of each book 
 */
const Book = ({ book, moveBook }) => {
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
				<div className="book-authors">{book.author ? book.author : 'No Author'}</div>
				<AddRating book={book} />
				<div className="book-info">
					<div className="date-read">Read on 11-12-20</div>
					<input type="checkbox" name="isLibraryBook" />
					<label id="isLibraryBook">Library Book</label>
					<div className="comment">Comment</div>
				</div>
			</div>
		</li>
	);
};

export default Book;
