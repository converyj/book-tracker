import React, { useState, useEffect, useCallback, useRef } from 'react';
import './dropdown.css';
import { trancateTitle } from './../utils/helper';
import { searchBook } from '../utils/api';

export default function Dropdown({ query, setTitle }) {
	const [
		books,
		setBooks
	] = useState({});
	const [
		selected,
		setSelected
	] = useState({});

	/* Whenever query changes */
	useEffect(
		() => {
			const search = () => searchBook(query).then((books) => setBooks(books));
			search();
		},
		[
			query
		]
	);

	/* Callback function when book item is clicked */
	const handleBook = useCallback((id, books) => {
		setSelected(Object.values(books).filter((book) => book.id === id));
	}, []);

	/* when selected state changes */
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
				{Object.values(books).map((book) => (
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
							<p>{book.volumeInfo.authors}</p>
						</div>
					</li>
				))}
			</ul>
		</React.Fragment>
	);
}
