import React, { useState, useEffect, useCallback, useRef } from 'react';
import './dropdown.css';
import { trancateTitle } from './../utils/helper';
import { searchBook } from '../utils/api';
import { PropTypes } from 'prop-types';

/**
 * @description Responsible for displaying the list of books 
 */

export default function Dropdown({ query, setTitle }) {
	const [
		books,
		setBooks
	] = useState({});
	const [
		selected,
		setSelected
	] = useState({});

	/* updates the list of books whenever query changes only with book's that have authors are are not duplicates*/
	useEffect(
		() => {
			if (query.length > 0) {
				const search = () =>
					searchBook(query).then((allBooks) => {
						console.log(allBooks);
						const filteredArr = allBooks.reduce((acc, current) => {
							const x = acc.find((item) => {
								if (!item) return;
								return item.id === current.id;
							});
							console.log(x);
							if (!x) {
								return acc.concat(current);
							}
							else {
								return acc;
							}
						}, []);
						setBooks(filteredArr);
					});

				search();
			}
		},
		[
			query
		]
	);

	// /* updates the list of books whenever query changes */
	// useEffect(
	// 	(books) => {

	// 				const books = books.filter((book) =>
	// 					console.log(book.volumeInfo.hasOwnProperty('author'))
	// 				);

	// 				setBooks(books);
	// 			});

	// 	},
	// 	[
	// 		books
	// 	]
	// );

	/* Callback function to set the selected book that was clicked on from the list of books */
	const handleBook = useCallback(
		(id, books) => {
			setSelected(Object.values(books).filter((book) => book.id === id));
		},
		[
			selected
		]
	);

	/* set the book title state when the selected book is updated */
	useEffect(
		() => {
			if (selected && selected.length > 0) {
				setTitle(selected[0]);
			}
		},
		[
			selected
		]
	);

	return (
		<React.Fragment>
			<ul className="search-book-list">
				{books &&
					books.length > 0 &&
					Object.values(books).map((book) => (
						<li
							key={book.id}
							id={book.id}
							onClick={(e) =>
								handleBook(e.target.closest('.search-book-list__item').id, books)}
							className="search-book-list__item">
							<img
								src={
									book.volumeInfo.imageLinks &&
									book.volumeInfo.imageLinks.smallThumbnail
								}
								alt=""
							/>
							<div>
								<p className="search-book-list__item-title">
									{trancateTitle(book.volumeInfo.title)}
								</p>
								{/* <p>{book.volumeInfo.authors.join(', ')}</p> */}
							</div>
						</li>
					))}
			</ul>
		</React.Fragment>
	);
}

Dropdown.propTypes = {
	query: PropTypes.string.isRequired,
	setTitle: PropTypes.func
};
