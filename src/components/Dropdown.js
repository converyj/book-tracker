import React, { useState, useEffect, useCallback } from 'react';
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

	/* updates the list of books whenever query changes only if component is mounted (dropdown is showing only if query is not empty)*/
	useEffect(
		() => {
			let mounted = true;
			const search = () =>
				searchBook(query)
					.then((allBooks) => {
						const filteredArr = allBooks.filter((book) => {
							return (
								book.volumeInfo.hasOwnProperty('authors') &&
								book.volumeInfo.hasOwnProperty('imageLinks')
							);
						});
						if (mounted) setBooks(filteredArr);
					})
					.catch((err) => console.log(err));

			search();
			return () => (mounted = false);
		},
		[
			query
		]
	);

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
								<p>{book.volumeInfo.authors.join(', ')}</p>
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
