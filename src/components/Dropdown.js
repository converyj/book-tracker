import React from 'react';

export default function Dropdown({ books }) {
	return (
		<React.Fragment>
			<ul>
				{Object.values(books).map((book) => (
					<li key={book.id}>
						{book.volumeInfo.title}
						<img
							src={
								book.volumeInfo.imageLinks &&
								book.volumeInfo.imageLinks.smallThumbnail
							}
							alt=""
						/>
					</li>
				))}
			</ul>
		</React.Fragment>
	);
}
